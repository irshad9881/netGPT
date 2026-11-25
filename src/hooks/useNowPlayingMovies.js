import { useDispatch, useSelector } from "react-redux";
import { addNowPlayingMovies } from "../utiles/moviesSlice";
import { useEffect } from "react";
import { fetchNowPlayingMovies } from "../utiles/media-api";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  const nowPlayingMovies = useSelector((store) => store?.movies?.nowPlayingMovies);

  useEffect(() => {
    if (nowPlayingMovies) return undefined;
    let cancelled = false;
    fetchNowPlayingMovies()
      .then((results) => {
        if (!cancelled) dispatch(addNowPlayingMovies(results));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // Fetch once while the list is empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useNowPlayingMovies;
