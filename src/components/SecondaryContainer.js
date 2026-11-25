import { useSelector } from "react-redux";
import MoviesList from "./MoviesList";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  return (
    <div className="bg-black">
      <div className="mt-0 md:-mt-40 pl-0 md:pl-0 relative z-20 mb-2">
        <MoviesList title="Now playing" movies={movies?.nowPlayingMovies} />
        <MoviesList title="Popular TV" movies={movies?.comedyMovies} />
        <MoviesList title="TV series" movies={movies?.tvSeriesMovies} />
        <MoviesList title="Upcoming movies" movies={movies?.popularMovies} />
      </div>
    </div>
  );
};

export default SecondaryContainer;
