import { useSelector } from "react-redux";
import MoviesList from "./MoviesList";
const SecondrayContainer=()=>{
    const movies=useSelector((store)=>store.movies)   
    return (
        <div className="bg-black"> 
           <div className="mt-0 md:-mt-40 pl-0 md:pl-0  relative z-20 mb-2">
            <MoviesList title={"now playing"} movies={movies?.nowPlayingMovies}/>
            <MoviesList title={"Populr Movies"} movies={movies?.comodianMovies}/>
            <MoviesList title={"Tv Series Movies"} movies={movies?.tvSeriesMovies}/>
            <MoviesList title={"Upcoming Movies"} movies={movies?.populerMovies}/>
           </div>
        </div>
    )
};
export default SecondrayContainer;