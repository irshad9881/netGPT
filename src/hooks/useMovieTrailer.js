import { useDispatch  } from "react-redux";
import { addMovieTrailer } from "../utiles/movisesSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utiles/constants";

const useMovieTrailer=(moveiId)=>{
    const diaptch=useDispatch();
    const getMovieVideos = async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/'+ moveiId +'/videos?language=en-US', API_OPTIONS);
        const json = await data?.json();
        const filtedData = json?.results?.filter((video) => video?.type === "Trailer")
        const trailer = filtedData?.length ? filtedData[0] : json?.results[0];
         
        diaptch(addMovieTrailer(trailer));
    }
    useEffect(() => {
        getMovieVideos();
    }, [])
}
export default useMovieTrailer;