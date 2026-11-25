import { useDispatch, useSelector } from "react-redux";
import { addMovieTrailer } from "../utiles/moviesSlice";
import { useEffect } from "react";
import { fetchMediaVideos } from "../utiles/media-api";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const nowMovieTrailer = useSelector((store) => store?.movies?.nowMovieTrailer);

  useEffect(() => {
    if (!movieId) return undefined;
    if (nowMovieTrailer && nowMovieTrailer.movieId === movieId) return undefined;

    let cancelled = false;
    fetchMediaVideos(movieId)
      .then((videoResults) => {
        if (cancelled) return;
        const trailers = videoResults.filter((video) => video?.type === "Trailer");
        const trailer = trailers[0] || videoResults[0] || null;
        dispatch(
          addMovieTrailer(trailer ? { ...trailer, movieId } : { movieId })
        );
      })
      .catch(() => {
        if (!cancelled) dispatch(addMovieTrailer({ movieId }));
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);
};

export default useMovieTrailer;
