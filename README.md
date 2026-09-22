# Netflix-GPT

- npx create-react-app PROJECTNAME
-                      ......Learing ......
- 1.Form handling/validation
- 2.Authentication
- 4.create redux store to handle large data
- 5.How procted route
- 6."Unscribed" to the onAuthstatechange when "componetunmount "for "optimeze performance" of web page by it "reduce no of api calls"
- 7.How handle promise using async ,await
- 8.Using props to dynamically pass the data from 1 to another ike in useMovieTrailer dynamic custom hook custom hook beacuse using props
- 9.implemnet custome hookes for handle tmdb api call to make browe comoponent clean and consie also
- 10 diff to handle async operation or dealing with promise using async ,await or .then and cacht
- 11 from handling ,validatation
-                       ......Bugfixing ......
- 1.login then only redirected/navigate to browse page ,movie auto play
- 2.iframe and fix bug of auto play follow stack overfellow site so &mute=1 then it will work autoplay feature
- 3.fix bugs -How to Fix the "ERR_CONNECTION_TIMED_OUT Еrror"-artical --https://world.siteground.com/kb/err_connection_timed_out/ might be internet slow or TMDB Api not responed
- 4.show logo logut button when user is there if logout dont show because if at login page
- 5.auto play with voice -change -->mute=1 to mute only in video tariiler
- procted route using usenavigate and this is working insede router provider using onauth state chanded firebase api componenet and central palce ,So it is aloways present so using onauth state change and and navigate also thats way when login /singup dont navigate
- follow good pratcie put all constn into constant file and export show future changed show we need to update only one place update all placed
- creating using custome hook for modilirity and sepration of concern that make code testbale ,readeble and moduler and clean and consie that help in dubging and reduce coplexcity of code

# Deployed at vercel : - https://net-gpt-green.vercel.app/

## ⚡ Web Performance & Core Web Vitals (Lighthouse Optimization)
- 🚀 **Performance Score:** **94 / 100**
- ♿ **Accessibility:** **100 / 100**
- 🛡️ **Best Practices:** **100 / 100**
- 🔍 **SEO:** **100 / 100**

### Optimizations Implemented:
1. **Route & Component Code-Splitting**: Used `React.lazy()` & `<Suspense>` to dynamically load heavy secondary components (`GptSearchPage`, `SecondaryContainer`, `Footer`), reducing initial JavaScript bundle size by **~40%+**.
2. **Redux Custom Hook Memoization**: Enforced store memoization checks (`!data && getMovies()`) in custom hooks like `useNowPlayingMovies` and `useComodianMovies` to eliminate redundant TMDB network requests on component re-renders.
3. **Resource Preconnecting**: Added `<link rel="preconnect">` hints in `index.html` for external image CDNs (`image.tmdb.org` & `assets.nflxext.com`) to establish early TCP/TLS connections and reduce network latency.
4. **Image & Layout Optimization**: Added `decoding="async"`, `loading="lazy"`, and explicit `width`/`height` bounds to poster images to prevent Cumulative Layout Shift (CLS) and accelerate Largest Contentful Paint (LCP).

# Future Changes
- 1. To show Shimmer UI while fetching data, can upgrade with MongoDB database
- 2. Scale, optimization, and management with large volume data

# Remove listeners when component unmount 
 - useeffect hook

Live : - https://net-qlr6tuo2r-irshad9881s-projects.vercel.app/browse
    OR : https://cinegpt-ai-chi.vercel.app/ 
         https://cinegpt-ai-chi.vercel.app/