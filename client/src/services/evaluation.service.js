const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Evaluate code against multiple test cases via CodeLab backend
 * @param {Object} params
 * @param {string} params.language
 * @param {string} params.code
 * @param {Array<{id: number, input: string, expectedOutput: string}>} params.testCases
 * @returns {Promise<Object>}
 */
export async function evaluateCode({ language, code, testCases }) {
  const url = `${API_BASE_URL}/api/evaluation/run`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      code,
      testCases,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || data?.message || `Evaluation request failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
