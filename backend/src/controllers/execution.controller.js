const jobService = require('../services/job.service');

/**
 * Execution Controller
 */
class ExecutionController {
  /**
   * Handle code execution request
   * POST /api/execution/run
   */
  async runCode(req, res, next) {
    try {
      const { language, code, stdin } = req.body;

      const job = jobService.createExecutionJob({ language, code, stdin });

      return res.status(200).json({
        success: true,
        status: job.status,
        message: job.message,
        jobId: job.jobId,
        language: job.language,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ExecutionController();
