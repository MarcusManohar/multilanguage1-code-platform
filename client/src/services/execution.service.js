const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Execute code via CodeLab backend
 * @param {Object} params
 * @param {string} params.language
 * @param {string} params.code
 * @param {string} [params.stdin]
 * @returns {Promise<Object>}
 */
export async function runCode({ language, code, stdin = '' }) {
  const url = `${API_BASE_URL}/api/execution/run`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      code,
      stdin,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || data?.message || `Execution request failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
