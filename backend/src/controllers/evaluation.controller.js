const jobService = require('../services/job.service');

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

      const job = jobService.createEvaluationJob({ language, code, testCases });

      return res.status(200).json({
        success: true,
        status: job.status,
        message: 'Evaluation engine will be connected in the next stage.',
        jobId: job.jobId,
        language: job.language,
        testCasesCount: job.testCasesCount,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new EvaluationController();
