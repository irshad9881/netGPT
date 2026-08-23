import { useDispatch } from "react-redux";
import { addMovieTrailer } from "../utiles/movisesSlice";
import { useEffect } from "react";
import { API_OPTIONS, TMDB_API_URL } from "../utiles/constants";

const useMovieTrailer = (moveiId) => {
    const dispatch = useDispatch();

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

            dispatch(addMovieTrailer(trailer));
        } catch (error) {
            console.error("Error fetching trailer videos:", error);
            dispatch(addMovieTrailer(null));
        }
    };

    useEffect(() => {
        getMovieVideos();
    }, [moveiId]);
};

export default useMovieTrailer;