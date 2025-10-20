import { useSelector } from "react-redux";
import MoviesList from "./MoviesList"
const GptMoviesSuggestion = () => {
  const {moviesName,moviesResults}=useSelector(store=>store?.gpt);
   if(!moviesName)
  // { //shimer ui
  //   return <h1 className="font-bold text-xs text-white ">Loading...</h1>;
  // }
{ //shimer ui
    return <h2 className="font-bold text-3xl text-white flex justify-center mt-20  bg-black p-4 rounded-3xl  ">No movies</h2>;
  }  return (
    <div className="p-4 m-4 bg-black text-teal-50 bg-opacity-90 text-sm md:text-lg">
      <div>
        {
          moviesName?.map((moviesName,index)=> {
            const movieData = moviesResults[index]?.value || moviesResults[index];
            return (
              <MoviesList 
                key={moviesName}
                title={moviesName}
                movies={movieData}
              />
            );
          })
        }
      </div>
    </div>
  )
}

export default GptMoviesSuggestion; 
