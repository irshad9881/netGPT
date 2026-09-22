import GptSearchBar from "./GptSearchBar";
import GptMoviesSuggestion from "./GptMoviesSuggestion";
import { LOGIN_BG } from "../utiles/constants";
const GptSearchPage=()=>{
    return(
       <>
            <div className="fixed inset-0 -z-10">
               <img className="h-full w-full object-cover" src={LOGIN_BG} alt="" />
               <div className="absolute inset-0 bg-black/65" />
            </div>
             <div className=" ">
               <GptSearchBar/>
               <GptMoviesSuggestion/>
             </div>
       </>
      
    );
}
export default GptSearchPage;