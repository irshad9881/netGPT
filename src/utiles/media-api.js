import { API_BASE_URL } from "./api-config";

const readErrorMessage = async (response) => {
  const payload = await response.json().catch(() => ({}));
  return payload.message || "Request failed";
};

const sendMediaRequest = async (path, { method = "GET", body } = {}) => {
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

const listResults = async (path) => {
  const payload = await sendMediaRequest(path);
  return Array.isArray(payload.results) ? payload.results : [];
};

export const fetchNowPlayingMovies = () => listResults("/api/media/now-playing");
export const fetchUpcomingMovies = () => listResults("/api/media/upcoming");
export const fetchAiringTv = () => listResults("/api/media/tv-airing");
export const fetchPopularTv = () => listResults("/api/media/tv-popular");

export const fetchMediaVideos = async (mediaId) => {
  const payload = await sendMediaRequest(
    `/api/media/videos/${encodeURIComponent(mediaId)}`
  );
  return Array.isArray(payload.results) ? payload.results : [];
};

export const searchMovieTMDB = async (movie) => {
  const payload = await sendMediaRequest(
    `/api/media/search?query=${encodeURIComponent(movie)}`
  );
  return Array.isArray(payload.results) ? payload.results : [];
};

export const recommendMovieNames = (query) =>
  sendMediaRequest("/api/media/recommend", {
    method: "POST",
    body: { query },
  });
