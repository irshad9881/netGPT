import { useDispatch, useSelector } from "react-redux";
import lang from "../utiles/languageConstant";
import { useEffect, useRef, useState } from "react";
import { recommendMovieNames, searchMovieTMDB } from "../utiles/media-api";
import { addGptMoviesResults, setIsSearching, setSearchMissed } from "../utiles/gptSlice";
import { fetchAiSearchQueries, saveAiSearchQuery } from "../utiles/ai-search-api";
import { looksLikeMovieQuery } from "../utiles/movie-intent";

const nameCache = new Map();
const GptSearchBar=()=>{
  const dispatch=useDispatch();
    const langKey=useSelector(store=>store.config.lang);
    const isSearching=useSelector(store=>store.gpt.isSearching);
     const searchText=useRef(null);
     const [recentQueries, setRecentQueries] = useState([]);

     const loadRecentQueries = async () => {
       try {
         const payload = await fetchAiSearchQueries();
         setRecentQueries(Array.isArray(payload.queries) ? payload.queries : []);
       } catch (_error) {
         setRecentQueries([]);
       }
     };

     useEffect(() => {
       loadRecentQueries();
       // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);
    const  handleGptSearchBar=async ()=>{
      const query = searchText.current?.value?.trim();
      if (!query || isSearching) return;

      dispatch(setIsSearching(true));
      try {
      const cacheKey = query.toLowerCase();
      const cached = nameCache.get(cacheKey);
      let intent = cached || null;
      let isFallback = Boolean(cached?.isFallback);
      let directSearchMovieTitle = null;
      let directSearchResult = null;

      if (cached?.type === "none") {
        dispatch(setSearchMissed());
        return;
      }

      if (!intent) {
        try {
          intent = await recommendMovieNames(query);
        } catch (error) {
          console.error("Recommend API failed, attempting fallback:", error);
          intent = { type: "empty" };
        }
      }

      if (intent.type === "none") {
        nameCache.set(cacheKey, { type: "none" });
        dispatch(setSearchMissed());
        return;
      }

      let gptmovies = intent.type === "movies" ? intent.names : null;

      if (!gptmovies) {
        const rawTMDBResults = await searchMovieTMDB(query).catch(() => []);
        if (rawTMDBResults?.length) {
          directSearchMovieTitle = rawTMDBResults[0].title;
          directSearchResult = rawTMDBResults;
          gptmovies = [directSearchMovieTitle];
        } else if (looksLikeMovieQuery(query)) {
          isFallback = true;
          const FALLBACK_GENRES = {
            comedy: ["Golmaal", "Hera Pheri", "Dhamaal", "Chup Chup Ke", "Welcome"],
            action: ["Sholay", "Gadar", "Vikram", "K.G.F", "Baahubali"],
            scifi: ["Koi Mil Gaya", "Krrish", "Ra.One", "2.0", "Cargo"],
            horror: ["Bhool Bhulaiyaa", "Tumbbad", "Stree", "Raju Gari Gadhi", "1920"],
            romantic: ["Dilwale Dulhania Le Jayenge", "Jab We Met", "Yeh Jawaani Hai Deewani", "Kuch Kuch Hota Hai", "2 States"],
            drama: ["3 Idiots", "Dangal", "Taare Zameen Par", "Swades", "Chhichhore"],
          };
          const queryText = query.toLowerCase();
          if (queryText.includes("comedy") || queryText.includes("funny") || queryText.includes("laugh")) {
            gptmovies = FALLBACK_GENRES.comedy;
          } else if (queryText.includes("action") || queryText.includes("thriller") || queryText.includes("adventure")) {
            gptmovies = FALLBACK_GENRES.action;
          } else if (queryText.includes("scifi") || queryText.includes("sci-fi") || queryText.includes("space")) {
            gptmovies = FALLBACK_GENRES.scifi;
          } else if (queryText.includes("horror") || queryText.includes("scary") || queryText.includes("ghost")) {
            gptmovies = FALLBACK_GENRES.horror;
          } else if (queryText.includes("romance") || queryText.includes("romantic") || queryText.includes("love")) {
            gptmovies = FALLBACK_GENRES.romantic;
          } else {
            gptmovies = FALLBACK_GENRES.drama;
          }
        } else {
          nameCache.set(cacheKey, { type: "none" });
          dispatch(setSearchMissed());
          return;
        }
      }

      nameCache.set(cacheKey, { type: "movies", names: gptmovies, isFallback });

      const promisArray=gptmovies.map((movie)=>{
        if (directSearchMovieTitle && movie === directSearchMovieTitle && directSearchResult) {
          return Promise.resolve(directSearchResult);
        }
        return searchMovieTMDB(movie);
      });
      const tmdbResults=await Promise.allSettled(promisArray);

      const serializableResults = tmdbResults.map((result) => {
        if (result.status === "fulfilled") {
          return {
            status: "fulfilled",
            value: result.value || [],
          };
        }
        return {
          status: "rejected",
          reason: result.reason instanceof Error ? result.reason.message : String(result.reason),
        };
      });

      const withPosters = gptmovies
        .map((title, index) => ({
          title,
          result: serializableResults[index],
        }))
        .filter((row) => Array.isArray(row.result?.value) && row.result.value.length);

      if (!withPosters.length) {
        nameCache.set(cacheKey, { type: "none" });
        dispatch(setSearchMissed());
        return;
      }

      dispatch(addGptMoviesResults({
        title: withPosters.map((row) => row.title),
        moviesResults: withPosters.map((row) => row.result),
        isFallback,
      }));
      saveAiSearchQuery(query)
        .then(() => loadRecentQueries())
        .catch(() => {});
      } catch (error) {
        console.error("Search failed:", error);
        dispatch(setIsSearching(false));
      }
    }

    const handleRecentQueryClick = (query) => {
      if (!searchText.current || isSearching) return;
      searchText.current.value = query;
      handleGptSearchBar();
    };

    return(
        <div className="pt-[45%]  md:pt-[10%] flex flex-col items-center ">
            <form className="w-full md:w-1/2  bg-black grid grid-cols-12 " onSubmit={(e)=>e.preventDefault()}>
                <input  ref={searchText} className="h-10 md:h-15  hover:text-white hover:bg-gray-300 p-1 m-1 md:p-2 md:m-2 col-span-9" type="text" placeholder={lang[langKey].gptSearchPlaceholder}/>
                <button disabled={isSearching} onClick={handleGptSearchBar}className="h-9 my-auto  md:h-10 p-2 m-1 md:p-2 md:m-2 hover:bg-red-700 col-span-3 m-2 py-2 px-4 bg-red-600 text-white rounded-lg disabled:opacity-70 disabled:cursor-not-allowed">{isSearching ? "Searching..." : lang[langKey].search}</button>
            </form>
            {recentQueries.length > 0 && (
              <section className="w-full md:w-1/2 mt-4 px-1">
                <p className="mb-2 text-base font-bold tracking-wide text-emerald-400 sm:text-lg">
                  Recent searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentQueries.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      disabled={isSearching}
                      onClick={() => handleRecentQueryClick(item.query)}
                      className={`max-w-full truncate rounded-full px-3 py-1 text-xs transition disabled:opacity-60 ${
                        index === 0
                          ? "border border-red-500/80 bg-red-600/90 text-white"
                          : "border border-white/20 bg-black/70 text-zinc-200 hover:border-white/50 hover:bg-white/10"
                      }`}
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              </section>
            )}
        </div>
    );
}
export default GptSearchBar;