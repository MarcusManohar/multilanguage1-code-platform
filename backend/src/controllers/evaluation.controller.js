const evaluationService = require('../services/evaluation.service');

/**
 * Evaluation Controller
 */
class EvaluationController {
  /**
   * Handle automated test-case evaluation request
   * POST /api/evaluation/run
   */
  async runEvaluation(req, res, next) {
    try {
      const { language, code, testCases } = req.body;

      const result = await evaluationService.evaluateCode({ language, code, testCases });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new EvaluationController();

