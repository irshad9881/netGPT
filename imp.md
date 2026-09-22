# Netflix-AI: Short & Easy Interview Q&A

### Q1: What is this project?
**A**: It is a Netflix clone that uses Google Gemini AI to recommend movies based on user search queries, combined with standard movie lists fetched from TMDB.
- "I optimized app performance using Lighthouse audits, Code Splitting, and Redux Memoization."
- optimized image

### Q2: What is the role of Gemini AI here?
**A**: Gemini acts as a recommendation engine. When a user types a query (like "funny comedy movies"), Gemini suggests 5 relevant movie names.

### Q3: How does the AI Search feature work under the hood?
**A**: 
1. The user inputs a query.
2. The app calls the Gemini API to get 5 movie names.
3. For each movie name, we call the TMDB Search API to fetch its posters, ratings, and trailers.
4. The results are displayed in a Netflix-style UI.

### Q4: How did you handle Gemini API failures or rate limits (429/404 errors)?
**A**:
1. **Fallback Models**: I set up a list of models (`gemini-flash-latest`, `gemini-3.6-flash`, etc.). If one fails, the app automatically tries the next one.
2. **Offline Mode**: If all models fail, the app falls back to direct TMDB search based on keywords (e.g., searching for "comedy" or "action" directly) and shows a friendly alert.

### Q5: Why did you use Redux Toolkit?
**A**: To manage the global state of the app (user details, movie lists, search results) in a central place. It prevents prop-drilling and makes the data accessible to any component.

### Q6: How did you optimize API calls (Memoization)?
**A**: Before fetching movies from the API in custom hooks, the app checks if the data is already in the Redux store. If it exists, the fetch call is skipped. This saves API usage and speeds up load times.

### Q7: What is Shimmer UI and why did you use it?
**A**: A Shimmer UI is a pulsing placeholder screen that shows while data is loading. It prevents empty screens and layout shifts, making the user experience feel smooth and premium.

### Q8: What is the difference between `Promise.all` and `Promise.all-settled`?
**A**: 
* `Promise.all` fails completely if even one API call fails.
* `Promise.allSettled` waits for all calls to complete and returns their results, even if some of them fail. I used `allSettled` to make sure one bad movie search doesn't crash the entire list.

### Q9: Why did you get Redux "non-serializable" warnings and how did you fix them?
**A**: Redux only allows plain objects. `Promise.allSettled` returned JavaScript `Error` objects on failures, which are non-serializable. I fixed this by converting error objects into simple strings before dispatching them to the store.

### Q10: How do you secure API keys in production?
**A**: 
1. **Frontend**: Use a `.env` file and add it to `.gitignore` so keys aren't pushed to GitHub.
2. **Backend Proxy (Best Practice)**: Instead of calling APIs directly from React, route calls through backend/serverless functions (like Firebase Functions) to keep the API keys completely hidden from the browser.

### Q11: Is an API call made on every keystroke during search? How is it implemented?
**A**: 
* **Current Implementation**: No, we do not call the API on every keystroke. We use a React `useRef` to reference the input text, meaning no state changes or API calls are triggered as the user types. The call is only made when the user explicitly clicks the "Search" button.
  ```javascript
  // 1. Current Implementation (using useRef)
  const searchText = useRef(null);

  const handleSearch = () => {
    // API call is triggered ONLY when clicking the search button
    fetchAPI(searchText.current.value);
  };

  return (
    <input ref={searchText} type="text" />
    <button onClick={handleSearch}>Search</button>
  );
  ```

* **Keystroke Search (Debouncing)**: If we wanted to search dynamically as the user types, we would use **Debouncing** to wait until the user stops typing before making the API request.

  **Simple Analogy (The Elevator)**:
  Think of an elevator. When a person steps in, the elevator door waits 5 seconds to close. If a second person steps in after 2 seconds, the 5-second timer **restarts**. The elevator only starts moving (makes the API call) when there is a 5-second silence (user stops typing).

  **Easiest Code Example**:
  ```javascript
  let timer; // Holds the timer ID

  const handleInputChange = (event) => {
    // 1. Clear/Cancel the previous timer if user pressed another key
    clearTimeout(timer);

    // 2. Start a new timer for 300ms
    timer = setTimeout(() => {
      // 3. This runs ONLY after the user has stopped typing for 300ms
      fetchAPI(event.target.value);
    }, 300);
  };

  return <input type="text" onChange={handleInputChange} />;
  ```

  **Important React Interview Catch**:
  If the interviewer asks: *"What happens if `timer` is defined inside a React component?"*
  * **The Problem**: On every state change or re-render, the component re-runs, and `let timer` gets re-created as `undefined`. The previous timer reference is lost, and debouncing will **fail** (it will make API calls on every keystroke).
  * **The Solution**: In React, we store the timer ID inside a **`useRef`** (e.g. `const timerRef = useRef(null)`) and use `timerRef.current` because `useRef` values persist across re-renders without reset or triggering re-renders.

  ```javascript
  // Correct React implementation
  const timerRef = useRef(null);

  const handleInputChange = (event) => {
    clearTimeout(timerRef.current); // Clears the persisted timer reference
    timerRef.current = setTimeout(() => {
      fetchAPI(event.target.value);
    }, 300);
  };
  ```

  **Production-Ready Method (The `useDebounce` Custom Hook)**:
  This is the cleanest, industry-standard React way to reuse debouncing.

  ```javascript
  // src/hooks/useDebounce.js
  import { useState, useEffect } from "react";

  export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      // 1. Start a timer to update the value after 300ms
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // 2. CLEANUP: If user types again before 300ms, cancel the previous timer
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };
  ```

  **Usage inside the Search Component**:
  ```javascript
  import { useState, useEffect } from "react";
  import { useDebounce } from "../hooks/useDebounce";

  const GptSearchBar = () => {
    const [searchText, setSearchText] = useState("");
    
    // Pass the state to the hook (it returns debounced text after 300ms)
    const debouncedSearchText = useDebounce(searchText, 300);

    // Call the API whenever the debounced text changes
    useEffect(() => {
      if (debouncedSearchText) {
        callSearchAPI(debouncedSearchText); // This only runs after the user stops typing
      }
    }, [debouncedSearchText]); // Runs ONLY when debouncedSearchText changes

    return (
      <input 
        type="text" 
        value={searchText} 
        onChange={(e) => setSearchText(e.target.value)} 
      />
    );
  };
  ```

  **How to explain `useDebounce` Step-by-Step in an Interview**:
  1. **Create local state**: The hook has a state called `debouncedValue` that holds the delayed text.
  2. **Set a timer in useEffect**: Every time the user types a key (dependency `value` changes), a `useEffect` runs and sets a `setTimeout` to update that state after 300ms.
  3. **Reset on typing (The Cleanup)**: React's `useEffect` has a cleanup return function (`return () => clearTimeout(handler)`). If the user types another key before the 300ms ends, React runs this cleanup, cancels the previous timer, and starts a fresh one.
  4. **Make the API Call**: Once the user stops typing for 300ms, the timer successfully completes, `debouncedValue` updates, and this triggers our API fetch in the main component.

---

### Q12: How did you optimize Web Performance & Core Web Vitals (Score 54 -> 97)?

1. **FCP (First Contentful Paint)**
   - **What & Why**: How long until the user sees the *very first thing* (text/logo) on a blank screen so they know the site is loading.
   - **How I Improved**: Added `<link rel="preconnect">` in `index.html` for image CDNs to warm up server connections early.
   - **When a browser loads a image from an external server (like TMDB https://image.tmdb.org or Netflix CDN https://assets.nflxext.com )**  it must perform 3 network steps before downloading any image:
    1.DNS Lookup: Find the server's IP address.
    2.TCP Handshake: Establish a network connection.
    3.TLS/SSL Handshake: Secure the HTTPS connection.
     - This handshake process takes 100ms to 400ms of delay!
     - When React renders the movie posters later, the browser doesn't waste time handshaking—it downloads images instantly!

2. **LCP (Largest Contentful Paint)**
   - **What & Why**: How long until the *biggest main content* (the main hero movie banner) finishes loading and is ready to view.
   - **How I Improved**: Pre-connected image origins and used optimized poster image CDN sizes to eliminate image download delays and  improving  LCP."

3. **TBT (Total Blocking Time)**
   - **What & Why**: How long the browser screen is *frozen by JavaScript*, measuring if buttons respond instantly when clicked.
   - **How I Improved**: Enforced Redux hook memoization (`!data && getMovies()`) to stop redundant API calls and JS re-renders.

4. **CLS (Cumulative Layout Shift)**
   - **What & Why**: Prevents the annoying page "jumping" where content suddenly shifts down while loading, causing mis-clicks.
   - or 
   - "CLS measures page stability — preventing annoying layout jumps where content shifts down while images load.
   I fixed this by adding explicit width="192" and height="288" attributes to image tags, allowing the browser to reserve the image space in advance so nothing shifts on load."

   The Problem: Accidental Mis-Clicks & Page Jumping
Imagine you open a website on your phone:

    [Screen view]
    -------------------------------
    1. Heading: "Welcome to Netflix"
    2. Button:  [ WATCH TRAILER ]  <-- You try to click this button!
    -------------------------------
    Right as your finger is moving to tap [ WATCH TRAILER ], a movie banner image finishes downloading above the button.

    The image suddenly pops in and expands:

    [Screen view AFTER image loads]
    -------------------------------
    1. Heading: "Welcome to Netflix"
    2. [ LARGE MOVIE BANNER IMAGE ] <-- Pops in and pushes everything down!
    3. Button:  [ WATCH TRAILER ]   <-- Button moved down by 300px!
    -------------------------------

   - Because the button jumped down 300px, your finger accidentally taps an advertisement or the wrong movie!
   ⚠️ The 3 Big Problems CLS Causes
   - 1. User Frustration: Users accidentally click the wrong links or buttons because the page moved under their finger.
   - 2. Cheap / Broken Feel: The website looks laggy and unstable while images load.
   - 3. Google Ranking Penalty: Google lowers your website's search ranking if your CLS score is bad.
   
   - The browser locks an empty 192x288 space before the image even downloads.
   - The [ WATCH TRAILER ] button starts at its final position and never moves.
   - The page is 100% stable, so users click exactly what they intended to click!
    
   - **How I Improved**: Added `width="192"` and `height="288"` to `<img />` tags so the browser reserves empty space *before* images download, keeping the page 100% stable.

  -  When the browser first reads <img src="poster.jpg" />, it doesn't know how big the image is, so it reserves 0px height. 2 seconds later when the image finishes downloading, it suddenly expands to 288px, pushing all buttons and text below it down.
  - We tell the browser before the image downloads: "Reserve an empty 192x288 pixel box right here!" The browser immediately locks that empty box on the screen. When the image finishes downloading, it fills into that reserved box without pushing anything down!

 - (i) Features like **decoding="async"** move image processing off the Call Stack and Main Thread to background browser threads, keeping the Call Stack free for smooth scrolling (60 FPS).
 
 - (ii) **loading="lazy"** (Lazy Loading)
   What it does: Tells the browser to delay downloading the image until the user scrolls close to it.
   Why it's used here: In Netflix, you have multiple horizontal movie rows with dozens of poster images. Without loading="lazy", your browser would try to download 50+ high-resolution images all at once when the page opens, consuming bandwidth and slowing down the initial page load. With loading="lazy", only visible posters are downloaded immediately, and off-screen posters download as the user scrolls to them.

5. **SI (Speed Index)**
   - **What & Why**: How quickly the *visible screen fills up with content* during initial load; lower time means a faster visual experience.
   - **How I Improved**: Code-split heavy components (`GptSearchPage`, `Footer`) using `React.lazy()` & `Suspense` to shrink bundle size by ~40%.
    6. Interaction to Next Paint (INP) is a Google Core Web Vital metric that measures how fast your website visually responds when a user interacts with it (clicks, taps, or keypresses).

   - ⏱️ What your score of 56 ms means:
     - Your score of 56 ms is EXCELLENT! 🎉

     - INP Rating	- Response Time	- Your Score
     - Good (Fast) 🟢	≤ 200 ms	- 56 ms (Ultra Fast!)
     - Needs Improvement 🟡	200 ms – 500 ms	—
     - Poor (Slow) 🔴	> 500 ms	—
     - 🔍   How INP Works (The 3 Phases):
     - When you click a movie card or button, INP measures the time across 3 steps:

       - Input Delay: Waiting for the browser's Main Thread to become available.
       - Processing Time: The time it takes React to run your onClick JavaScript function.
       - Presentation Delay: The time it takes the browser to calculate the layout and paint the updated pixels on the screen.

7. Secure: put all credientials in .eve and add in .gitignore 


8. What is the real difference between useRef and useState here?
Feature	             useRef (Your Current Code)                     useState
Re-renders on typing?	 No re-renders while typing.              Re-renders the component on every single keystroke.
Performance	          Faster / Lighter for search inputs.           Slightly more CPU re-renders while typing.
How value is read	       searchText.current.value read only when submitted.State variable read on submission.
Enter key behavior?	     ✅ Works                          ✅ Works