const onlineCompilerService = require('./onlineCompiler.service');

const MAX_TEST_CASES = 20;
const MAX_CODE_SIZE_BYTES = 64 * 1024; // 64 KB
const MAX_INPUT_SIZE_BYTES = 32 * 1024; // 32 KB

class EvaluationService {
  /**
   * Normalize output string for reliable comparison
   * Handles \r\n vs \n, per-line trailing whitespace, and leading/trailing blank lines
   * @param {string} str
   * @returns {string}
   */
  normalizeOutput(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();
  }

  /**
   * Determine failure classification reason
   * @param {Object} result Execution result from onlineCompilerService
   * @param {boolean} passed
   * @returns {string} "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error" | "Time Limit Exceeded"
   */
  determineFailureReason(result, passed) {
    if (passed) {
      return 'Accepted';
    }

    if (result.status === 'timeout' || result.timedOut) {
      return 'Time Limit Exceeded';
    }

    const err = (result.error || '').toLowerCase();

    // Check for compilation / syntax errors
    if (
      err.includes('syntaxerror') ||
      err.includes('compilation error') ||
      err.includes(': error:') ||
      err.includes('error: ') ||
      err.includes('javac') ||
      err.includes('g++:') ||
      err.includes('gcc:')
    ) {
      // Differentiate runtime traceback from syntax error in interpreted languages
      if (err.includes('traceback') && !err.includes('syntaxerror')) {
        return 'Runtime Error';
      }
      return 'Compilation Error';
    }

    // Non-zero exit code or runtime stderr
    if (result.exitCode !== 0 || (result.error && result.error.trim().length > 0)) {
      return 'Runtime Error';
    }

    return 'Wrong Answer';
  }

  /**
   * Validate evaluation request payload
   * @param {Object} payload
   */
  validatePayload({ language, code, testCases }) {
    if (!language || typeof language !== 'string' || !language.trim()) {
      const error = new Error('Field "language" is required and must be a non-empty string.');
      error.status = 400;
      throw error;
    }

    // Validate that language is supported by compiler service
    onlineCompilerService.resolveCompilerId(language);

    if (code === undefined || code === null || typeof code !== 'string') {
      const error = new Error('Field "code" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    if (code.trim().length === 0) {
      const error = new Error('Field "code" cannot be empty.');
      error.status = 400;
      throw error;
    }

    if (Buffer.byteLength(code, 'utf8') > MAX_CODE_SIZE_BYTES) {
      const error = new Error(`Code size exceeds maximum limit of ${MAX_CODE_SIZE_BYTES / 1024} KB.`);
      error.status = 400;
      throw error;
    }

    if (!Array.isArray(testCases)) {
      const error = new Error('Field "testCases" must be an array.');
      error.status = 400;
      throw error;
    }

    if (testCases.length === 0) {
      const error = new Error('At least one test case is required.');
      error.status = 400;
      throw error;
    }

    if (testCases.length > MAX_TEST_CASES) {
      const error = new Error(
        `Too many test cases. Maximum allowed is ${MAX_TEST_CASES} test cases per evaluation.`
      );
      error.status = 400;
      throw error;
    }

    // Validate each individual test case
    testCases.forEach((tc, idx) => {
      if (typeof tc !== 'object' || tc === null) {
        const error = new Error(`Test case at index ${idx} is invalid.`);
        error.status = 400;
        throw error;
      }

      if (tc.input !== undefined && tc.input !== null && typeof tc.input !== 'string') {
        tc.input = String(tc.input);
      } else if (tc.input === undefined || tc.input === null) {
        tc.input = '';
      }

      if (
        tc.expectedOutput !== undefined &&
        tc.expectedOutput !== null &&
        typeof tc.expectedOutput !== 'string'
      ) {
        tc.expectedOutput = String(tc.expectedOutput);
      } else if (tc.expectedOutput === undefined || tc.expectedOutput === null) {
        tc.expectedOutput = '';
      }

      if (Buffer.byteLength(tc.input, 'utf8') > MAX_INPUT_SIZE_BYTES) {
        const error = new Error(
          `Test case input at index ${idx} exceeds maximum allowed size of ${
            MAX_INPUT_SIZE_BYTES / 1024
          } KB.`
        );
        error.status = 400;
        throw error;
      }
    });
  }

  /**
   * Run automated code evaluation against provided test cases
   * @param {Object} params
   * @param {string} params.language
   * @param {string} params.code
   * @param {Array<Object>} params.testCases
   * @returns {Promise<Object>}
   */
  async evaluateCode({ language, code, testCases }) {
    this.validatePayload({ language, code, testCases });

    // Execute test cases through onlineCompilerService
    const evaluationPromises = testCases.map(async (tc, index) => {
      const testId = tc.id !== undefined && tc.id !== null ? tc.id : index + 1;
      const stdinInput = tc.input || '';
      const expectedOutput = tc.expectedOutput || '';

      try {
        const execResult = await onlineCompilerService.executeCode({
          language,
          code,
          stdin: stdinInput,
        });

        const normalizedActual = this.normalizeOutput(execResult.output);
        const normalizedExpected = this.normalizeOutput(expectedOutput);

        const hasZeroExit = execResult.exitCode === 0;
        const hasNoError = !execResult.error || execResult.error.trim() === '';
        const isOutputMatch = normalizedActual === normalizedExpected;

        const passed = hasZeroExit && hasNoError && isOutputMatch;
        const failureReason = this.determineFailureReason(execResult, passed);

        return {
          id: testId,
          passed,
          actualOutput: execResult.output || '',
          expectedOutput,
          executionTime: execResult.executionTime || '0',
          memory: execResult.memory || '0',
          ...(passed ? {} : { failureReason }),
          ...(execResult.error && execResult.error.trim() ? { error: execResult.error } : {}),
        };
      } catch (err) {
        return {
          id: testId,
          passed: false,
          actualOutput: '',
          expectedOutput,
          executionTime: '0',
          memory: '0',
          failureReason: err.status === 504 ? 'Time Limit Exceeded' : 'Runtime Error',
          error: err.message || 'Execution failed',
        };
      }
    });

    const evaluatedTestCases = await Promise.all(evaluationPromises);

    const passedCount = evaluatedTestCases.filter((tc) => tc.passed).length;
    const totalCount = evaluatedTestCases.length;
    const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    const totalSeconds = evaluatedTestCases.reduce(
      (sum, tc) => sum + (parseFloat(tc.executionTime) || 0),
      0
    );
    const totalExecutionTime = totalSeconds.toFixed(4);

    return {
      success: true,
      status: 'completed',
      score,
      passed: passedCount,
      total: totalCount,
      testCases: evaluatedTestCases,
      totalExecutionTime: String(totalExecutionTime),
    };
  }
}

module.exports = new EvaluationService();
