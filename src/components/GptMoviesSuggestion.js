import { useSelector } from "react-redux";
import MoviesList from "./MoviesList"
import { useNavigate } from "react-router-dom";
const GptMoviesSuggestion = () => {
  const navigate=useNavigate();
  const {moviesName,moviesResults}=useSelector(store=>store?.gpt);
   if(!moviesName)
  { //shimer ui
    return <h2 className="font-bold text-3xl text-white flex justify-center mt-20  bg-black p-4 rounded-3xl  ">No movies</h2>;
  }
  else if(!moviesResults) {
    return navigate("/error");
  }
  return (
    <div className="p-4 m-4 bg-black text-teal-50 bg-opacity-90 text-sm md:text-lg">
      <div>
        {
          moviesName?.map((moviesName,index)=>
          <MoviesList 
          key={moviesName}
          title={moviesName}
          movies={moviesResults[index]}
          />)
        }
      </div>
    </div>
  )
}

export default GptMoviesSuggestion; 
