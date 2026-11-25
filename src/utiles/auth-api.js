import { API_BASE_URL } from "./api-config";

const readErrorMessage = async (response) => {
  const payload = await response.json().catch(() => ({}));
  return payload.message || "Request failed";
};

const sendAuthRequest = async (path, { method = "GET", body } = {}) => {
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

export const registerWithEmail = (name, email, password) =>
  sendAuthRequest("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

export const verifyEmail = (email, code) =>
  sendAuthRequest("/api/auth/verify-email", {
    method: "POST",
    body: { email, code },
  });

export const loginWithEmail = (email, password) =>
  sendAuthRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const loginWithGoogle = (idToken) =>
  sendAuthRequest("/api/auth/google", {
    method: "POST",
    body: { idToken },
  });

export const fetchCurrentUser = () => sendAuthRequest("/api/users/me");

export const refreshAuthSession = () =>
  sendAuthRequest("/api/auth/refresh-session", { method: "POST" });

export const restoreCurrentUser = async () => {
  try {
    return await fetchCurrentUser();
  } catch (_error) {
    await refreshAuthSession();
    return fetchCurrentUser();
  }
};

export const resendVerificationCode = (email) =>
  sendAuthRequest("/api/auth/resend-verification-code", {
    method: "POST",
    body: { email },
  });

export const logoutCurrentSession = () =>
  sendAuthRequest("/api/auth/logout", { method: "POST" });

export const requestPasswordReset = (email) =>
  sendAuthRequest("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });

export const resetPasswordWithCode = (email, code, password) =>
  sendAuthRequest("/api/auth/reset-password", {
    method: "POST",
    body: { email, code, password },
  });
