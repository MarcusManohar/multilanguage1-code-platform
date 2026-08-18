const ONLINECOMPILER_API_URL = 'https://api.onlinecompiler.io/api/run-code-sync/';

// Mapping from frontend language identifiers to OnlineCompiler compiler IDs
const LANGUAGE_COMPILER_MAP = {
  cpp: 'g++-15',
  'c++': 'g++-15',
  c: 'gcc-15',
  python: 'python-3.14',
  py: 'python-3.14',
  python3: 'python-3.14',
  java: 'openjdk-25',
};

const SUPPORTED_LANGUAGES = ['cpp', 'c', 'python', 'java'];

class OnlineCompilerService {
  /**
   * Resolve language name/id to OnlineCompiler compiler ID
   * @param {string} language
   * @returns {string}
   */
  resolveCompilerId(language) {
    if (!language || typeof language !== 'string') {
      const error = new Error('Field "language" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    const normalizedLang = language.toLowerCase().trim();
    const compilerId = LANGUAGE_COMPILER_MAP[normalizedLang];

    if (!compilerId) {
      const error = new Error(
        `Unsupported language "${language}". Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}.`
      );
      error.status = 400;
      throw error;
    }

    return compilerId;
  }

  /**
   * Execute code using OnlineCompiler API
   * @param {Object} params
   * @param {string} params.language
   * @param {string} params.code
   * @param {string} [params.stdin='']
   * @returns {Promise<Object>}
   */
  async executeCode({ language, code, stdin = '' }) {
    const compilerId = this.resolveCompilerId(language);

    if (code === undefined || code === null || typeof code !== 'string') {
      const error = new Error('Field "code" is required and must be a string.');
      error.status = 400;
      throw error;
    }

    const apiKey = process.env.ONLINECOMPILER_API_KEY;
    if (!apiKey) {
      const error = new Error('ONLINECOMPILER_API_KEY is not configured on the server.');
      error.status = 500;
      throw error;
    }

    const payload = {
      compiler: compilerId,
      code,
      input: typeof stdin === 'string' ? stdin : '',
    };

    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      response = await fetch(ONLINECOMPILER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (networkError) {
      if (networkError.name === 'AbortError') {
        const error = new Error('Code execution request timed out after 30 seconds.');
        error.status = 504;
        throw error;
      }
      const error = new Error(`Failed to reach compilation service: ${networkError.message}`);
      error.status = 502;
      throw error;
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      const error = new Error('Received invalid non-JSON response from compilation service.');
      error.status = 502;
      throw error;
    }

    if (!response.ok) {
      const errorMsg =
        responseData && typeof responseData.error === 'string'
          ? responseData.error
          : `Compilation service responded with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status >= 400 && response.status < 500 ? 400 : 502;
      throw error;
    }

    // Determine success status
    const isStatusSuccess = responseData.status === 'success';
    const hasZeroExit = responseData.exit_code === 0;
    const hasNoError = !responseData.error || responseData.error.trim() === '';
    const success = isStatusSuccess || (hasZeroExit && hasNoError);

    return {
      success,
      status: responseData.status || (success ? 'success' : 'error'),
      output: typeof responseData.output === 'string' ? responseData.output : '',
      error: typeof responseData.error === 'string' ? responseData.error : '',
      exitCode: typeof responseData.exit_code === 'number' ? responseData.exit_code : (success ? 0 : 1),
      executionTime:
        responseData.time !== undefined && responseData.time !== null
          ? String(responseData.time)
          : '0',
      totalTime:
        responseData.total !== undefined && responseData.total !== null
          ? String(responseData.total)
          : '0',
      memory:
        responseData.memory !== undefined && responseData.memory !== null
          ? String(responseData.memory)
          : '0',
      signal: responseData.signal !== undefined ? responseData.signal : null,
    };
  }
}

module.exports = new OnlineCompilerService();
