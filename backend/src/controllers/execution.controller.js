const onlineCompilerService = require('../services/onlineCompiler.service');

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
      const { language, code, stdin = '' } = req.body;

      if (!language || typeof language !== 'string' || !language.trim()) {
        const error = new Error('Field "language" is required and must be a non-empty string.');
        error.status = 400;
        throw error;
      }

      if (code === undefined || code === null || typeof code !== 'string') {
        const error = new Error('Field "code" is required and must be a string.');
        error.status = 400;
        throw error;
      }

      const result = await onlineCompilerService.executeCode({
        language,
        code,
        stdin,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ExecutionController();

