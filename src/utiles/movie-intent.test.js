import {
  looksLikeMovieQuery,
  parseMovieIntentReply,
} from "./movie-intent";

describe("parseMovieIntentReply", () => {
  test("marks trivia as out of domain", () => {
    expect(parseMovieIntentReply("NONE")).toEqual({ type: "none" });
    expect(parseMovieIntentReply("NONE\n")).toEqual({ type: "none" });
  });

  test("parses MOVIES list", () => {
    expect(
      parseMovieIntentReply("MOVIES: Sholay, Don, Gadar, Golmaal, Koi Mil Gaya")
    ).toEqual({
      type: "movies",
      names: ["Sholay", "Don", "Gadar", "Golmaal", "Koi Mil Gaya"],
    });
  });

  test("returns empty for blank text", () => {
    expect(parseMovieIntentReply("")).toEqual({ type: "empty" });
  });
});

describe("looksLikeMovieQuery", () => {
  test("accepts mood and title-style English", () => {
    expect(looksLikeMovieQuery("dark comedy movies")).toBe(true);
  });

  test("rejects geography trivia", () => {
    expect(looksLikeMovieQuery("what is capital of india")).toBe(false);
  });
});
