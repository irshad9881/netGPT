import { useDispatch, useSelector } from "react-redux";
import { addComedyMovies } from "../utiles/moviesSlice";
import { useEffect } from "react";
import { fetchPopularTv } from "../utiles/media-api";

const useComedyMovies = () => {
  const dispatch = useDispatch();
  const comedyMovies = useSelector((store) => store?.movies?.comedyMovies);

  useEffect(() => {
    if (comedyMovies) return undefined;
    let cancelled = false;
    fetchPopularTv()
      .then((results) => {
        if (!cancelled) dispatch(addComedyMovies(results));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useComedyMovies;
