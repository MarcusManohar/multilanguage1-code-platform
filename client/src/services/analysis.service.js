const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Compare student code against reference code via CodeLab backend (Deterministic)
 * @param {Object} params
 * @param {string} params.language
 * @param {string} params.studentCode
 * @param {string} params.referenceCode
 * @returns {Promise<Object>}
 */
export async function compareCode({ language, studentCode, referenceCode }) {
  const url = `${API_BASE_URL}/api/analysis/compare`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      studentCode,
      referenceCode,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || data?.message || `Analysis comparison failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Compare student code against reference code with Gemini AI analysis report
 * @param {Object} params
 * @param {string} params.language
 * @param {string} params.studentCode
 * @param {string} params.referenceCode
 * @returns {Promise<Object>}
 */
export async function compareCodeWithAI({ language, studentCode, referenceCode }) {
  const url = `${API_BASE_URL}/api/analysis/compare-ai`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      studentCode,
      referenceCode,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || data?.message || `AI analysis comparison failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Run single code analysis
 * @param {Object} params
 * @param {string} params.language
 * @param {string} params.code
 * @returns {Promise<Object>}
 */
export async function runAnalysis({ language, code }) {
  const url = `${API_BASE_URL}/api/analysis/run`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      code,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || data?.message || `Analysis request failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
