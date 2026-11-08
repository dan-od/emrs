/**
 * Unwrap the accounts API envelope. The API returns { success, data } but
 * some endpoints return data directly; handle both.
 */
export const extractData = (response, defaultValue = null) => {
  if (!response) return defaultValue;
  if (response.success && response.data !== undefined) return response.data;
  return response;
};
