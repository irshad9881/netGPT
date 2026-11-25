import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";
import { MainContainerShimmer } from "./Shimmer";

const MainContainer=()=>{
    const movies=useSelector((store)=>store?.movies?.nowPlayingMovies);
    const selectedMovie=useSelector((store)=>store?.movies?.selectedMovie);

    const mainMovies = selectedMovie || movies?.[2] || movies?.[0];
    if(!mainMovies)
    return <MainContainerShimmer />;

    const {original_title,overview ,id }=mainMovies;
    return(
        <div className="">
            <VideoTitle title={original_title} overview={overview} />
            <VideoBackground moveiId={id} key={id}/>
        </div>
    )
};

export default MainContainer;
