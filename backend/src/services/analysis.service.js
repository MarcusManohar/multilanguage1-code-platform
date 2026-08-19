const pythonAnalyzer = require('../analysis/python.analyzer');
const javaAnalyzer = require('../analysis/java.analyzer');
const cAnalyzer = require('../analysis/c.analyzer');
const cppAnalyzer = require('../analysis/cpp.analyzer');
const similarityService = require('./similarity.service');
const aiService = require('./ai.service');

const MAX_CODE_SIZE_BYTES = 64 * 1024; // 64 KB
const SUPPORTED_LANGUAGES = ['c', 'cpp', 'java', 'python'];

class AnalysisService {
  /**
   * Resolve language analyzer
   * @param {string} language
   * @returns {Object} Analyzer instance and canonical language name
   */
  resolveAnalyzer(language) {
    if (!language || typeof language !== 'string') {
      const error = new Error('Field "language" is required and must be a non-empty string.');
      error.status = 400;
      throw error;
    }

    const norm = language.toLowerCase().trim();

    if (norm === 'python' || norm === 'py' || norm === 'python3') {
      return { analyzer: pythonAnalyzer, canonical: 'python' };
    }
    if (norm === 'cpp' || norm === 'c++') {
      return { analyzer: cppAnalyzer, canonical: 'cpp' };
    }
    if (norm === 'c') {
      return { analyzer: cAnalyzer, canonical: 'c' };
    }
    if (norm === 'java') {
      return { analyzer: javaAnalyzer, canonical: 'java' };
    }

    const error = new Error(
      `Unsupported language "${language}". Supported languages for analysis are: ${SUPPORTED_LANGUAGES.join(', ')}.`
    );
    error.status = 400;
    throw error;
  }

  /**
   * Run code analysis for submitted code
   * @param {Object} params
   * @param {string} params.language
   * @param {string} params.code
   * @returns {Promise<Object>} Normalized analysis result
   */
  async analyzeCode({ language, code }) {
    const { analyzer, canonical } = this.resolveAnalyzer(language);

    if (code === undefined || code === null || typeof code !== 'string') {
      const error = new Error('Field "code" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (Buffer.byteLength(code, 'utf8') > MAX_CODE_SIZE_BYTES) {
      const error = new Error(
        `Code size exceeds maximum limit of ${MAX_CODE_SIZE_BYTES / 1024} KB.`
      );
      error.status = 400;
      throw error;
    }

    const result = await analyzer.analyze(code);
    result.language = canonical;

    return result;
  }

  /**
   * Compare student code against reference code
   * @param {Object} params
   * @param {string} params.language
   * @param {string} params.studentCode
   * @param {string} params.referenceCode
   * @returns {Promise<Object>} Similarity comparison result
   */
  async compareCodes({ language, studentCode, referenceCode }) {
    const { analyzer, canonical } = this.resolveAnalyzer(language);

    if (studentCode === undefined || studentCode === null || typeof studentCode !== 'string') {
      const error = new Error('Field "studentCode" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (referenceCode === undefined || referenceCode === null || typeof referenceCode !== 'string') {
      const error = new Error('Field "referenceCode" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (
      Buffer.byteLength(studentCode, 'utf8') > MAX_CODE_SIZE_BYTES ||
      Buffer.byteLength(referenceCode, 'utf8') > MAX_CODE_SIZE_BYTES
    ) {
      const error = new Error(
        `Code size exceeds maximum limit of ${MAX_CODE_SIZE_BYTES / 1024} KB.`
      );
      error.status = 400;
      throw error;
    }

    // Analyze both programs in parallel
    const [studentAnalysis, referenceAnalysis] = await Promise.all([
      analyzer.analyze(studentCode),
      analyzer.analyze(referenceCode),
    ]);

    studentAnalysis.language = canonical;
    referenceAnalysis.language = canonical;

    const comparison = similarityService.compare(studentAnalysis, referenceAnalysis);

    return {
      success: true,
      language: canonical,
      similarity: comparison.similarity,
      student: studentAnalysis,
      reference: referenceAnalysis,
      explanation: comparison.explanation,
    };
  }

  /**
   * Compare codes with AI-enhanced analysis report
   * Runs deterministic comparison first, then passes structured results to Gemini
   * @param {Object} params
   * @param {string} params.language
   * @param {string} params.studentCode
   * @param {string} params.referenceCode
   * @returns {Promise<Object>} Comparison result with AI report
   */
  async compareCodesWithAI({ language, studentCode, referenceCode }) {
    // Step 1: Run the full deterministic comparison
    const deterministicResult = await this.compareCodes({ language, studentCode, referenceCode });

    // Step 2: Generate AI report from structured data
    const aiReport = await aiService.generateReport({
      language: deterministicResult.language,
      similarity: deterministicResult.similarity,
      studentAnalysis: deterministicResult.student,
      referenceAnalysis: deterministicResult.reference,
      explanation: deterministicResult.explanation,
    });

    return {
      ...deterministicResult,
      aiReport,
    };
  }

  /**
   * Run code analysis for submitted code and get student-friendly AI feedback
   * @param {Object} params
   * @param {string} params.language
   * @param {string} params.code
   * @returns {Promise<Object>} Analysis result with AI report
   */
  async analyzeCodeWithAI({ language, code }) {
    // Step 1: Run deterministic analysis to check for basic syntax issues
    const deterministicResult = await this.analyzeCode({ language, code });

    // Step 2: Generate AI report
    const aiReport = await aiService.analyzeStudentCodeWithAI({
      language: deterministicResult.language,
      code,
      studentAnalysis: deterministicResult
    });

    return {
      success: true,
      language: deterministicResult.language,
      aiReport,
    };
  }
}

module.exports = new AnalysisService();
