import React, { lazy, Suspense } from "react";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import Header from "./Header";
import MainContainer from "./MainContainer";
import usePopulerMovies from "../hooks/usePopolerMovies";
import useTvSeries from "../hooks/useTVSeries";
import useComodianMovies from "../hooks/useComodianMovies";
import { useSelector } from "react-redux";

// Lazy-load components to reduce initial JavaScript bundle size
const SecondrayContainer = lazy(() => import("./SeconderoyContainer"));
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
  usePopulerMovies();
  useTvSeries();
  useComodianMovies();

  return (
    <div>
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        {showGptSearchPage ? (
          <GptSearchPage />
        ) : (
          <>
            <MainContainer />
            <SecondrayContainer />
            <Footer />
          </>
        )}
      </Suspense>
    </div>
  );
};

export default Browse;