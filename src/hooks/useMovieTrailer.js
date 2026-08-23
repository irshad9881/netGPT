import { useDispatch, useSelector } from "react-redux";
import { addMovieTrailer } from "../utiles/movisesSlice";
import { useEffect } from "react";
import { API_OPTIONS, TMDB_API_URL } from "../utiles/constants";

const useMovieTrailer = (moveiId) => {
    const dispatch = useDispatch();
    const nowMovieTrailer = useSelector((store) => store?.movies?.nowMovieTrailer);

    const getMovieVideos = async () => {
        if (!moveiId) return;

        try {
            let videoResults = [];

            // 1. Try fetching from TMDB Movie endpoint
            const data = await fetch(TMDB_API_URL + '/3/movie/' + moveiId + '/videos?language=en-US', API_OPTIONS);
            if (data.ok) {
                const json = await data.json();
                if (Array.isArray(json?.results)) {
                    videoResults = json.results;
                }
            }

            // 2. If movie endpoint returns 404 or empty results, fallback to TV Series endpoint
            if (videoResults.length === 0) {
                const tvData = await fetch(TMDB_API_URL + '/3/tv/' + moveiId + '/videos?language=en-US', API_OPTIONS);
                if (tvData.ok) {
                    const tvJson = await tvData.json();
                    if (Array.isArray(tvJson?.results)) {
                        videoResults = tvJson.results;
                    }
                }
            }

            const filtedData = videoResults.filter((video) => video?.type === "Trailer");
            const trailer = filtedData.length ? filtedData[0] : (videoResults.length ? videoResults[0] : null);

            // Attach requested moveiId to trailer object for ID-based memoization tracking
            const trailerWithMovieId = trailer ? { ...trailer, movieId: moveiId } : { movieId: moveiId };

            dispatch(addMovieTrailer(trailerWithMovieId));
        } catch (error) {
            console.error("Error fetching trailer videos:", error);
            dispatch(addMovieTrailer({ movieId: moveiId }));
        }
    };

    useEffect(() => {
        // Memoization: Only fetch if trailer for THIS specific moveiId is not already in Redux
        if (!nowMovieTrailer || nowMovieTrailer.movieId !== moveiId) {
            getMovieVideos();
        }
    }, [moveiId]);
};

export default useMovieTrailer;