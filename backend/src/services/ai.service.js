const { GoogleGenAI } = require('@google/genai');

const PRIMARY_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';

class AIService {
  constructor() {
    this._ai = null;
  }

  /**
   * Lazily initialize the GoogleGenAI instance
   */
  _getAI() {
    if (this._ai) return this._ai;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const error = new Error('GEMINI_API_KEY is not configured in environment.');
      error.status = 503;
      throw error;
    }

    this._ai = new GoogleGenAI({ apiKey });
    return this._ai;
  }

  /**
   * Build structured prompt for Gemini
   */
  _buildPrompt({ language, similarity, studentAnalysis, referenceAnalysis, explanation }) {
    const sMetrics = studentAnalysis.metrics || {};
    const rMetrics = referenceAnalysis.metrics || {};

    return JSON.stringify(
      {
        language: language.toUpperCase(),
        similarityScores: {
          lexical: `${similarity.lexical}%`,
          structural: `${similarity.structural}%`,
          controlFlow: `${similarity.controlFlow}%`,
          complexity: `${similarity.complexity}%`,
          overall: `${similarity.overall}%`,
        },
        studentProgram: {
          linesOfCode: sMetrics.linesOfCode,
          functions: sMetrics.functions,
          loops: sMetrics.loops,
          conditionals: sMetrics.conditionals,
          cyclomaticComplexity: sMetrics.complexity,
          variables: sMetrics.variables,
          astNodeCount: studentAnalysis.ast?.nodeCount || 0,
          astDepth: studentAnalysis.ast?.depth || 0,
          syntaxValid: studentAnalysis.syntax?.valid !== false,
          keywords: studentAnalysis.lexical?.keywords || [],
          operators: studentAnalysis.lexical?.operators || [],
          tokenCount: studentAnalysis.lexical?.tokenCount || 0,
        },
        referenceProgram: {
          linesOfCode: rMetrics.linesOfCode,
          functions: rMetrics.functions,
          loops: rMetrics.loops,
          conditionals: rMetrics.conditionals,
          cyclomaticComplexity: rMetrics.complexity,
          variables: rMetrics.variables,
          astNodeCount: referenceAnalysis.ast?.nodeCount || 0,
          astDepth: referenceAnalysis.ast?.depth || 0,
          syntaxValid: referenceAnalysis.syntax?.valid !== false,
          keywords: referenceAnalysis.lexical?.keywords || [],
          operators: referenceAnalysis.lexical?.operators || [],
          tokenCount: referenceAnalysis.lexical?.tokenCount || 0,
        },
        deterministicObservations: {
          sharedStructures: explanation.similarStructures || [],
          differences: explanation.differences || [],
        },
      },
      null,
      2
    );
  }

  /**
   * Build system instruction for neutral, explainable code analysis
   */
  _getSystemInstruction() {
    return `You are CodeLab AI Analyzer, an objective code analysis engine that synthesizes structured static analysis and similarity data into an analytical explanation.

GUIDELINES:
1. You receive structured JSON containing AST metrics, token counts, complexity values, and deterministic similarity scores.
2. Produce an explainable, professional report in strict JSON format.
3. NEVER claim or imply that similarity proves plagiarism, cheating, academic misconduct, or unauthorized AI usage.
4. Treat code similarity strictly as an analytical signal comparing algorithms, syntax, and logic structures.
5. In your "assessment", always reiterate that structural similarity alone does not establish AI use or academic misconduct.
6. Do NOT invent source code or fabricate metric numbers. Use the exact provided data.
7. Return ONLY valid JSON conforming to the schema below.

JSON SCHEMA:
{
  "summary": "1-2 sentence high-level overview of how the two programs relate structurally and algorithmically",
  "similarityInterpretation": "Detailed explanation of what the lexical, structural, control-flow, and complexity scores indicate",
  "sharedFeatures": [
    "String describing a specific shared pattern (e.g. matching loop topology, identical function signatures, shared operators)"
  ],
  "differences": [
    "String describing a specific structural or operational difference (e.g. variable naming schemes, arithmetic operation differences)"
  ],
  "technicalObservations": [
    "Technical insight regarding AST depth, statement density, cyclomatic complexity, or efficiency"
  ],
  "assessment": "Objective summary concluding with the statement that code similarity is an analytical signal and does not by itself establish AI use or academic misconduct."
}`;
  }

  /**
   * Generate AI analysis report from structured comparison data
   * @param {Object} params
   * @param {string} params.language
   * @param {Object} params.similarity - Deterministic similarity scores
   * @param {Object} params.studentAnalysis - Student structured analysis
   * @param {Object} params.referenceAnalysis - Reference structured analysis
   * @param {Object} params.explanation - Deterministic explanation
   * @returns {Promise<Object>} AI report object conforming to required schema
   */
  async generateReport({ language, similarity, studentAnalysis, referenceAnalysis, explanation }) {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return {
        available: false,
        model: null,
        error: 'GEMINI_API_KEY is not configured in backend environment.',
        report: this._generateFallbackReport({ language, similarity, explanation }),
      };
    }

    const promptData = this._buildPrompt({
      language,
      similarity,
      studentAnalysis,
      referenceAnalysis,
      explanation,
    });

    const systemInstruction = this._getSystemInstruction();

    // Attempt primary model first, fallback if unavailable
    let responseText = null;
    let usedModel = PRIMARY_MODEL;

    try {
      const ai = this._getAI();
      const res = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: promptData,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      responseText = res.text;
    } catch (primaryErr) {
      // If primary model failed, attempt fallback model
      try {
        const ai = this._getAI();
        usedModel = FALLBACK_MODEL;
        const fallbackRes = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: promptData,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });
        responseText = fallbackRes.text;
      } catch (fallbackErr) {
        // Sanitize error without exposing API key
        const safeMessage =
          primaryErr.status === 429 || fallbackErr.status === 429
            ? 'Gemini API rate limit reached. Please wait a moment.'
            : `AI analysis service unavailable: ${fallbackErr.message || primaryErr.message}`;

        return {
          available: false,
          model: null,
          error: safeMessage,
          report: this._generateFallbackReport({ language, similarity, explanation }),
        };
      }
    }

    // Parse JSON response safely
    try {
      const parsed = JSON.parse(responseText.trim());
      return {
        available: true,
        model: usedModel,
        report: {
          summary: parsed.summary || 'Structural comparison completed.',
          similarityInterpretation:
            parsed.similarityInterpretation ||
            `Programs exhibit ${similarity.overall}% overall structural similarity across lexical, AST, control-flow, and complexity dimensions.`,
          sharedFeatures: Array.isArray(parsed.sharedFeatures)
            ? parsed.sharedFeatures
            : explanation.similarStructures || [],
          differences: Array.isArray(parsed.differences)
            ? parsed.differences
            : explanation.differences || [],
          technicalObservations: Array.isArray(parsed.technicalObservations)
            ? parsed.technicalObservations
            : [`Cyclomatic complexity and AST depth align with ${similarity.overall}% confidence.`],
          assessment:
            parsed.assessment ||
            'The programs show structural patterns consistent with standard programming practices. Similarity analysis is an analytical signal and does not by itself establish AI use or academic misconduct.',
        },
      };
    } catch {
      // In case of JSON parse error, return structured fallback
      return {
        available: true,
        model: usedModel,
        report: this._generateFallbackReport({ language, similarity, explanation }),
      };
    }
  }

  /**
   * Generate deterministic fallback report when AI API is unavailable
   */
  _generateFallbackReport({ language, similarity, explanation }) {
    const level =
      similarity.overall >= 80 ? 'high' : similarity.overall >= 50 ? 'moderate' : 'low';

    return {
      summary: `The submitted ${language.toUpperCase()} programs exhibit ${level} structural alignment with an overall similarity rating of ${similarity.overall}%.`,
      similarityInterpretation: `Lexical similarity (${similarity.lexical}%), AST structure (${similarity.structural}%), control-flow branching (${similarity.controlFlow}%), and complexity density (${similarity.complexity}%) form the composite metric.`,
      sharedFeatures: explanation.similarStructures || [
        'Shared basic programmatic syntax and language constructs.',
      ],
      differences: explanation.differences || [
        'No critical structural deviations detected.',
      ],
      technicalObservations: [
        `Control-flow similarity: ${similarity.controlFlow}%`,
        `Lexical keyword & operator alignment: ${similarity.lexical}%`,
      ],
      assessment:
        'Similarity analysis is an analytical signal and does not by itself establish AI use or academic misconduct.',
    };
  }
}

module.exports = new AIService();
