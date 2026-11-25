const IN_DOMAIN_HINT =
  /\b(movie|movies|film|films|series|show|shows|actor|actress|director|cinema|bollywood|hollywood|anime|netflix|watch|thriller|comedy|funny|horror|romance|romantic|drama|action|sci-?fi|scifi)\b/i;

export const looksLikeMovieQuery = (query) => IN_DOMAIN_HINT.test(String(query || ""));

export const parseMovieIntentReply = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return { type: "empty" };

  const compact = raw.replace(/\s+/g, " ");
  const upper = compact.toUpperCase();
  if (/^NONE\b/.test(upper) && !upper.includes("MOVIES:")) {
    return { type: "none" };
  }

  let namesPart = compact;
  const marker = upper.indexOf("MOVIES:");
  if (marker !== -1) {
    namesPart = compact.slice(marker + 7);
  }

  const names = namesPart
    .split(",")
    .map((name) => name.replace(/^\s*\d+[\.)]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  if (!names.length) return { type: "empty" };
  return { type: "movies", names };
};

export const movieIntentPrompt = (query) =>
  `You classify search queries for a movie streaming app.
User query: "${query}"
If it is about movies, TV, actors, genres, or moods, reply with exactly:
MOVIES: Title1, Title2, Title3, Title4, Title5
If it is not about movies/TV (trivia, geography, news, homework, random text), reply with exactly:
NONE
No other words.`;
