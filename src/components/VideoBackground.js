
import {   useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
const VideoBackground = ({ moveiId }) => {
    useMovieTrailer(moveiId);
    const trailerVideo=useSelector(store=>store?.movies?.nowMovieTrailer);
        // if(trailerVideo=="") return <h1> Loading...</h1>
        // console.log(trailerVideo)
        return (
            <div className="w-screen aspect-video  md:pt-0">
                <iframe  
                className="w-screen aspect-video pt-12 md:pt-0 "
                src={"https://www.youtube.com/embed/"+ trailerVideo?.key+"?&autoplay=1&mute=1"}
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                >
                </iframe>
            </div>
        );
};
export default VideoBackground;