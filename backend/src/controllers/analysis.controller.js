const analysisService = require('../services/analysis.service');

/**
 * Analysis Controller
 */
class AnalysisController {
  /**
   * Handle code analysis request
   * POST /api/analysis/run
   */
  async runAnalysis(req, res, next) {
    try {
      const { language, code } = req.body;

      const result = await analysisService.analyzeCode({ language, code });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Handle code similarity comparison request (deterministic only)
   * POST /api/analysis/compare
   */
  async compareCode(req, res, next) {
    try {
      const { language, studentCode, referenceCode } = req.body;

      const result = await analysisService.compareCodes({
        language,
        studentCode,
        referenceCode,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Handle AI-enhanced code similarity comparison request
   * POST /api/analysis/compare-ai
   */
  async compareWithAI(req, res, next) {
    try {
      const { language, studentCode, referenceCode } = req.body;

      const result = await analysisService.compareCodesWithAI({
        language,
        studentCode,
        referenceCode,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Handle AI code analysis request (student code only)
   * POST /api/analysis/run-ai
   */
  async runAIAnalysis(req, res, next) {
    try {
      const { language, code } = req.body;

      const result = await analysisService.analyzeCodeWithAI({ language, code });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AnalysisController();
