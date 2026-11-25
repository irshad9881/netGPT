import { useDispatch, useSelector } from "react-redux";
import { addPopularMovies } from "../utiles/moviesSlice";
import { useEffect } from "react";
import { fetchUpcomingMovies } from "../utiles/media-api";

const usePopularMovies = () => {
  const dispatch = useDispatch();
  const popularMovies = useSelector((store) => store?.movies?.popularMovies);

  useEffect(() => {
    if (popularMovies) return undefined;
    let cancelled = false;
    fetchUpcomingMovies()
      .then((results) => {
        if (!cancelled) dispatch(addPopularMovies(results));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default usePopularMovies;
