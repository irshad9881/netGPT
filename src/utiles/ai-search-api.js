import { API_BASE_URL } from "./api-config";

const readErrorMessage = async (response) => {
  const payload = await response.json().catch(() => ({}));
  return payload.message || "Request failed";
};

const sendAiSearchRequest = async (path, { method = "GET", body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json().catch(() => ({}));
};

export const saveAiSearchQuery = (query) =>
  sendAiSearchRequest("/api/ai-search-queries", {
    method: "POST",
    body: { query },
  });

export const fetchAiSearchQueries = () =>
  sendAiSearchRequest("/api/ai-search-queries");
