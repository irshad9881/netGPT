import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContainer=()=>{
    const movies=useSelector((store)=>store?.movies?.nowPlayingMovies);
    const selectedMovie=useSelector((store)=>store?.movies?.selectedMovie);
    
    if(movies===null)//"early return" if insily thre is no moives
    return  ;
    
    // Use selected movie or fallback to default movie
    const mainMovies = selectedMovie || movies[2];
    const {original_title,overview ,id }=mainMovies;
    return(
        <div className="">
            <VideoTitle title={original_title} overview={overview} />
            <VideoBackground moveiId={id} key={id}/>
        </div>
    )
};

export default MainContainer;