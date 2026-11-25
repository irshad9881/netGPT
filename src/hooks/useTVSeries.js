import { useDispatch, useSelector } from "react-redux";
import { addTvSeries } from "../utiles/moviesSlice";
import { useEffect } from "react";
import { fetchAiringTv } from "../utiles/media-api";

const useTvSeries = () => {
  const dispatch = useDispatch();
  const tvSeriesMovies = useSelector((store) => store?.movies?.tvSeriesMovies);

  useEffect(() => {
    if (tvSeriesMovies) return undefined;
    let cancelled = false;
    fetchAiringTv()
      .then((results) => {
        if (!cancelled) dispatch(addTvSeries(results));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useTvSeries;
