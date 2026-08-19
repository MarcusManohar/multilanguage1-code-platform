const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');

const PRIMARY_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';

class AIService {
  constructor() {
    this._ai = null;
    this.studentAnalysisCache = new Map();
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

  _getStudentAnalysisSystemInstruction() {
    return `You are CodeLab AI Assistant, a beginner-friendly programming tutor. Your job is to analyze a student's code and provide simple, actionable feedback.

GUIDELINES:
1. Be extremely clear, concise, and encouraging. Use simple language.
2. NEVER mention technical metrics like AST, node density, cyclomatic complexity, lexical similarity, token counts, or structural similarity.
3. If there is a compilation error, syntax error, or logical bug, clearly explain it and how to fix it.
4. If the code is perfectly correct and efficient, say so. Do not invent problems.
5. Focus on what is right, what is wrong, and how to improve.
6. Return ONLY valid JSON conforming to the schema below.
7. Keep your explanations concise. Limit your response length to what is strictly necessary to populate the required fields. Do NOT write long paragraphs.

JSON SCHEMA:
{
  "overallStatus": {
    "status": "Correct" | "Mostly correct" | "Has errors",
    "explanation": "A short one-sentence explanation of the status."
  },
  "problems": [
    "String describing a specific bug, syntax error, or logical mistake."
  ],
  "whatItDoes": "Beginner-friendly explanation of the code's purpose.",
  "improvements": [
    {
      "suggestion": "Practical improvement suggestion",
      "reason": "Why this improvement is useful in simple terms"
    }
  ],
  "performance": {
    "meaningful": boolean,
    "explanation": "Simple explanation of time/space complexity, only if meaningful (e.g. 'Time: O(n) — the program goes through the list once.'). If not meaningful or too simple, leave empty."
  },
  "testCases": [
    {
      "description": "What to test (e.g., edge cases)",
      "expectedResult": "Expected behavior"
    }
  ],
  "beginnerTip": "One short educational tip relevant to the code."
}`;
  }

  _buildStudentAnalysisPrompt({ language, code, syntaxValid }) {
    return JSON.stringify(
      {
        language: language.toUpperCase(),
        code: code,
        syntaxValid: syntaxValid !== false
      },
      null,
      2
    );
  }

  async analyzeStudentCodeWithAI({ language, code, studentAnalysis }) {
    const cacheKey = crypto.createHash('md5').update(`${language}:${code}`).digest('hex');
    if (this.studentAnalysisCache.has(cacheKey)) {
      console.log(`[AI Service] Cache hit for ${language} analysis.`);
      return this.studentAnalysisCache.get(cacheKey);
    }

    const promptData = this._buildStudentAnalysisPrompt({
      language,
      code,
      syntaxValid: studentAnalysis?.syntax?.valid
    });
    const systemInstruction = this._getStudentAnalysisSystemInstruction();

    // 1. Try CodeSentinel first
    try {
      const { Client } = require("@gradio/client");
      const startTime = Date.now();
      const hfToken = process.env.HF_TOKEN;
      console.log(`[AI Service] CodeSentinel request started (Auth configured: ${!!hfToken})...`);
      
      const connectOptions = hfToken ? { token: hfToken } : {};
      const codesentinel = await Client.connect("PraneetNS/CodeSentinel", connectOptions);
      const fullPrompt = `${systemInstruction}\n\n${promptData}`;
      
      const predictPromise = codesentinel.predict("/generate", [fullPrompt]);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("CodeSentinel timeout")), 15000));
      
      const result = await Promise.race([predictPromise, timeoutPromise]);
      const duration = Date.now() - startTime;
      console.log(`[AI Service] CodeSentinel response received. Duration: ${duration}ms`);

      const responseText = result.data[0];
      
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      if (!Array.isArray(parsed.problems)) parsed.problems = [];

      const finalReport = {
        available: true,
        model: 'CodeSentinel',
        report: parsed,
      };
      
      this.studentAnalysisCache.set(cacheKey, finalReport);
      return finalReport;
    } catch (csError) {
      console.error('[AI Service Error] CodeSentinel failed, falling back to Gemini:', csError.message);
    }

    // 2. Fallback to Gemini
    const geminiStartTime = Date.now();
    if (!process.env.GEMINI_API_KEY) {
      return {
        available: false,
        model: null,
        error: 'GEMINI_API_KEY is not configured in backend environment.',
        report: this._generateStudentFallbackReport(language),
      };
    }

    let responseText = null;
    let usedModel = PRIMARY_MODEL;

    try {
      const ai = this._getAI();
      const res = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: promptData,
        config: {
          systemInstruction,
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      responseText = res.text;
    } catch (primaryErr) {
      try {
        const ai = this._getAI();
        usedModel = FALLBACK_MODEL;
        const fallbackRes = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: promptData,
          config: {
            systemInstruction,
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        });
        responseText = fallbackRes.text;
      } catch (fallbackErr) {
        const safeMessage =
          primaryErr.status === 429 || fallbackErr.status === 429
            ? 'Gemini API rate limit reached. Please wait a moment.'
            : `AI analysis service unavailable: ${fallbackErr.message || primaryErr.message}`;

        console.error('[AI Service Error]:', safeMessage);

        return {
          available: false,
          model: null,
          error: safeMessage,
          report: this._generateStudentFallbackReport(language),
        };
      }
    }

    try {
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      
      // Ensure problems is an array or default to empty
      if (!Array.isArray(parsed.problems)) parsed.problems = [];
      
      const geminiDuration = Date.now() - geminiStartTime;
      console.log(`[AI Service] Gemini fallback response received. Duration: ${geminiDuration}ms`);

      const finalReport = {
        available: true,
        model: usedModel,
        report: parsed,
      };
      
      this.studentAnalysisCache.set(cacheKey, finalReport);
      return finalReport;
    } catch (parseError) {
      console.error('[AI Parse Error] Failed to parse Gemini response:', parseError.message);
      console.error('Raw response snippet:', responseText ? responseText.substring(0, 200) : 'null');
      
      return {
        available: true,
        model: usedModel,
        error: 'AI generated an invalid response format.',
        report: this._generateStudentFallbackReport(language),
      };
    }
  }

  _generateStudentFallbackReport(language) {
    return {
      overallStatus: {
        status: "Mostly correct",
        explanation: "AI analysis is currently unavailable to fully verify this code."
      },
      problems: [],
      whatItDoes: `This is a ${language.toUpperCase()} program. AI analysis is offline, so a detailed breakdown is unavailable.`,
      improvements: [],
      performance: { meaningful: false, explanation: "" },
      testCases: [{ description: "Run with standard inputs", expectedResult: "Verify the output matches expectations" }],
      beginnerTip: "Always test your code with different inputs to find hidden bugs!"
    };
  }
}

module.exports = new AIService();
