import React, { lazy, Suspense } from "react";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import Header from "./Header";
import MainContainer from "./MainContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useTvSeries from "../hooks/useTVSeries";
import useComedyMovies from "../hooks/useComedyMovies";
import { useSelector } from "react-redux";

// Lazy-load components to reduce initial JavaScript bundle size
const SecondaryContainer = lazy(() => import("./SecondaryContainer"));
const GptSearchPage = lazy(() => import("./GptSearchPage"));
const Footer = lazy(() => import("./Footer"));

const LoadingFallback = () => (
  <div className="w-screen h-48 bg-black/50 flex items-center justify-center text-red-600 font-semibold text-lg">
    Loading...
  </div>
);

const Browse = () => {
  const showGptSearchPage = useSelector((store) => store.gpt.showGptSearchPage);
  useNowPlayingMovies();
  usePopularMovies();
  useTvSeries();
  useComedyMovies();

  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {showGptSearchPage ? (
            <GptSearchPage />
          ) : (
            <>
              <MainContainer />
              <SecondaryContainer />
              <Footer />
            </>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default Browse;