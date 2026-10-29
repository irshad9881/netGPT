# Netflix-GPT
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

# Remove listeners when component unmount 
 - useeffect hook

Live : - https://net-qlr6tuo2r-irshad9881s-projects.vercel.app/browse
    OR : https://cinegpt-ai-chi.vercel.app/ 
