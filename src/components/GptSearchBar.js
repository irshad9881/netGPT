import { useDispatch, useSelector } from "react-redux";
import lang from "../utiles/languageConstant";
import { useRef } from "react";
import { getGeminiResponse } from "../utiles/gemini";
import { API_OPTIONS, TMDB_SEARCH_API_URL } from "../utiles/constants";
import { addGptMoviesResults } from "../utiles/gptSlice";
import Error from "./Error";
const GptSearchBar=()=>{
  const dispatch=useDispatch();
    const langKey=useSelector(store=>store.config.lang);
     const searchText=useRef(null);
     const searchMovieTMDB=async (movie)=>{
     const data= await fetch(TMDB_SEARCH_API_URL + "?query="+movie+"&include_adult=false&language=en-US&page=1",API_OPTIONS);
     const json = await data?.json();
     return json?.results;
     }
    const  handleGptSearchBar=async ()=>{
      //make api call
      const gptQuery="Act as Movie Recommendation system and suggest some movies for the query: "+
      searchText.current.value 
      +" only give me name of  five movies ,comma seperated like the example results:Sholay, Don, Gadar, Golmaal, Koi Mil Gaya";
      
      let gptResults = null;
      let isFallback = false;
      
      try {
        gptResults = await getGeminiResponse(gptQuery);
      } catch (error) {
        console.error("Gemini API call failed, attempting fallback:", error);
      }
      
      let gptmovies;
      
      if(!gptResults) 
      {
        isFallback = true;
        const FALLBACK_GENRES = {
          comedy: ["Golmaal", "Hera Pheri", "Dhamaal", "Chup Chup Ke", "Welcome"],
          action: ["Sholay", "Gadar", "Vikram", "K.G.F", "Baahubali"],
          scifi: ["Koi Mil Gaya", "Krrish", "Ra.One", "2.0", "Cargo"],
          horror: ["Bhool Bhulaiyaa", "Tumbbad", "Stree", "Raju Gari Gadhi", "1920"],
          romantic: ["Dilwale Dulhania Le Jayenge", "Jab We Met", "Yeh Jawaani Hai Deewani", "Kuch Kuch Hota Hai", "2 States"],
          drama: ["3 Idiots", "Dangal", "Taare Zameen Par", "Swades", "Chhichhore"],
          default: ["Sholay", "3 Idiots", "Dangal", "Hera Pheri", "Dilwale Dulhania Le Jayenge"]
        };

        const queryText = (searchText.current.value || "").toLowerCase();
        let fallbackMovies = [];

        if (queryText.includes("comedy") || queryText.includes("funny") || queryText.includes("laugh") || queryText.includes("joke") || queryText.includes("hilarious")) {
          fallbackMovies = [...FALLBACK_GENRES.comedy];
        } else if (queryText.includes("action") || queryText.includes("fight") || queryText.includes("thriller") || queryText.includes("adventure") || queryText.includes("stunt")) {
          fallbackMovies = [...FALLBACK_GENRES.action];
        } else if (queryText.includes("scifi") || queryText.includes("sci-fi") || queryText.includes("space") || queryText.includes("future") || queryText.includes("alien")) {
          fallbackMovies = [...FALLBACK_GENRES.scifi];
        } else if (queryText.includes("horror") || queryText.includes("scary") || queryText.includes("ghost") || queryText.includes("creepy") || queryText.includes("spooky")) {
          fallbackMovies = [...FALLBACK_GENRES.horror];
        } else if (queryText.includes("romance") || queryText.includes("romantic") || queryText.includes("love") || queryText.includes("heart")) {
          fallbackMovies = [...FALLBACK_GENRES.romantic];
        } else if (queryText.includes("drama") || queryText.includes("emotional") || queryText.includes("sad") || queryText.includes("family")) {
          fallbackMovies = [...FALLBACK_GENRES.drama];
        } else {
          fallbackMovies = [...FALLBACK_GENRES.default];
        }

        if (searchText.current.value && searchText.current.value.trim() !== "") {
          try {
            const rawTMDBResults = await searchMovieTMDB(searchText.current.value);
            if (rawTMDBResults && rawTMDBResults.length > 0) {
              const topMovieTitle = rawTMDBResults[0].title;
              if (!fallbackMovies.includes(topMovieTitle)) {
                fallbackMovies.unshift(topMovieTitle);
              }
            }
          } catch (tmdbError) {
            console.error("Direct TMDB search fallback failed:", tmdbError);
          }
        }

        gptmovies = fallbackMovies.slice(0, 5);
      } else {
        //convert string into array using split fun and trim spaces
        gptmovies=gptResults.split(",").map(movie => movie.trim());
      }
      
      const promisArray=gptmovies?.map((movie)=>searchMovieTMDB(movie));//map in javascript not wait resoponse but  searchMovieTMDB async funtion take some time to return result so useiing 
      const tmdbResults=await Promise?.allSettled(promisArray);   //searchMoviTMDB return array of promise means it will return a promise for each movie  for getting result from this array usein Promise.all()
      
      // Make tmdbResults serializable for Redux by converting Error reasons to strings
      const serializableResults = tmdbResults.map((result) => {
        if (result.status === "fulfilled") {
          return {
            status: "fulfilled",
            value: result.value || [],
          };
        } else {
          return {
            status: "rejected",
            reason: result.reason instanceof Error ? result.reason.message : String(result.reason),
          };
        }
      });
      
      dispatch(addGptMoviesResults({title:gptmovies,moviesResults:serializableResults,isFallback:isFallback}));
    }
    return(
        <div className="pt-[45%]  md:pt-[10%] flex justify-center ">
            <form className="w-full md:w-1/2  bg-black grid grid-cols-12 " onSubmit={(e)=>e.preventDefault()}>
                <input  ref={searchText} className="h-10 md:h-15  hover:text-white hover:bg-gray-300 p-1 m-1 md:p-2 md:m-2 col-span-9" type="text" placeholder={lang[langKey].gptSearchPlaceholder}/>
                <button onClick={handleGptSearchBar}className="h-9 my-auto  md:h-10 p-2 m-1 md:p-2 md:m-2 hover:bg-red-700 col-span-3 m-2 py-2 px-4 bg-red-600 text-white rounded-lg">{lang[langKey].search}</button>
            </form>
        </div>
    );
}
export default GptSearchBar;