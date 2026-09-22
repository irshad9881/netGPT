import { useSelector } from "react-redux";
import MoviesList from "./MoviesList"
import { MovieListShimmer } from "./Shimmer"
const GptMoviesSuggestion = () => {
  const { moviesName, moviesResults, isFallback, isSearching } = useSelector(store => store?.gpt);

  if (isSearching) {
    return (
      <div className="p-4 m-4 bg-black text-teal-50 bg-opacity-90 rounded-lg">
        <MovieListShimmer title="Finding movies..." />
        <MovieListShimmer />
        <MovieListShimmer />
        <MovieListShimmer />
        <MovieListShimmer />
      </div>
    );
  }

  if (!moviesName) {
    return null;
  }
  return (
    <div className="p-4 m-4 bg-black text-teal-50 bg-opacity-90 text-sm md:text-lg rounded-lg">
      {isFallback && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-950/40 border border-yellow-800/60 text-yellow-300 flex items-center gap-3 shadow-inner backdrop-blur-sm">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-200">Gemini AI is currently offline</p>
            <p className="text-yellow-400/80 text-xs mt-0.5">We searched TMDB directly and suggested some related popular titles for you.</p>
          </div>
        </div>
      )}
      <div>
        {
          moviesName?.map((moviesName, index) => {
            const movieData = moviesResults[index]?.value || moviesResults[index];
            return (
              <MoviesList
                key={moviesName}
                title={moviesName}
                movies={movieData}
              />
            );
          })
        }
      </div>
    </div>
  )
}

export default GptMoviesSuggestion;
