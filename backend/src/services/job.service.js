/**
 * Service to orchestrate compilation and evaluation jobs
 */
class JobService {
  /**
   * Create code execution job placeholder
   */
  createExecutionJob({ language, code, stdin = '' }) {
    if (!language || typeof language !== 'string') {
      const error = new Error('Field "language" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (code === undefined || code === null || typeof code !== 'string') {
      const error = new Error('Field "code" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    const jobId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      jobId,
      language: language.toLowerCase().trim(),
      hasStdin: Boolean(stdin && stdin.length > 0),
      status: 'queued',
      createdAt: new Date().toISOString(),
      message: 'Code execution service is not connected yet.',
    };
  }

  /**
   * Create code evaluation job placeholder
   */
  createEvaluationJob({ language, code, testCases = [] }) {
    if (!language || typeof language !== 'string') {
      const error = new Error('Field "language" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (code === undefined || code === null || typeof code !== 'string') {
      const error = new Error('Field "code" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (!Array.isArray(testCases)) {
      const error = new Error('Field "testCases" must be an array.');
      error.status = 400;
      throw error;
    }

    const jobId = `eval_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      jobId,
      language: language.toLowerCase().trim(),
      testCasesCount: testCases.length,
      status: 'queued',
      createdAt: new Date().toISOString(),
      message: 'Evaluation engine is not connected yet.',
    };
  }
}

module.exports = new JobService();
