import { useSelector } from "react-redux";
import MoviesList from "./MoviesList"
import { MovieListShimmer } from "./Shimmer"
const GptMoviesSuggestion = () => {
  const { moviesName, moviesResults, isSearching, searchMissed } = useSelector(store => store?.gpt);

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

  if (searchMissed) {
    return (
      <div className="p-4 m-4 bg-black/90 text-white rounded-lg max-w-2xl mx-auto">
        <p className="text-lg font-semibold">We didn&apos;t find movies for that</p>
        <p className="mt-1 text-sm text-zinc-400">
          Try a title, actor, or mood — e.g. &quot;dark comedy&quot; or &quot;movies like Inception&quot;.
        </p>
      </div>
    );
  }

  if (!moviesName) {
    return null;
  }
  return (
    <div className="p-4 m-4 bg-black text-teal-50 bg-opacity-90 text-sm md:text-lg rounded-lg">
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
