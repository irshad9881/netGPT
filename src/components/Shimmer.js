import React from "react";

export const MovieCardShimmer = () => {
  return (
    <div className="w-28 sm:w-32 md:w-40 lg:w-48 h-42 sm:h-48 md:h-60 lg:h-72 bg-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg animate-pulse shadow-md relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export const MovieListShimmer = ({ title }) => {
  // Render 6 cards for loading skeleton
  const placeholderCards = Array(6).fill(null);

  return (
    <section className="px-4 py-6 bg-gradient-to-r from-black/30 to-transparent">
      {title ? (
        <h2 className="text-xl md:text-3xl font-bold text-white/80 mb-6 tracking-wide select-none">
          {title}
        </h2>
      ) : (
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6 animate-pulse" />
      )}
      
      <div className="relative">
        <div className="flex gap-4 overflow-x-hidden pb-4 px-12">
          {placeholderCards.map((_, index) => (
            <MovieCardShimmer key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const MainContainerShimmer = () => {
  return (
    <div className="relative w-screen aspect-video bg-zinc-950 flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden border-b border-zinc-900/50">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-zinc-950/20 animate-pulse z-0" />
      
      {/* Skeleton Hero Content */}
      <div className="relative z-10 max-w-md md:max-w-lg lg:max-w-xl flex flex-col justify-center">
        {/* Title Placeholder */}
        <div className="h-8 md:h-12 w-3/4 bg-zinc-800 rounded-md mb-4 animate-pulse" />
        
        {/* Description Placeholder */}
        <div className="space-y-3 mb-6 md:mb-8">
          <div className="h-4 w-full bg-zinc-800 bg-gradient-to-r from-zinc-800 to-zinc-800/60 rounded-md animate-pulse" />
          <div className="h-4 w-5/6 bg-zinc-800 bg-gradient-to-r from-zinc-800 to-zinc-800/60 rounded-md animate-pulse" />
          <div className="h-4 w-4/6 bg-zinc-800 bg-gradient-to-r from-zinc-800 to-zinc-800/60 rounded-md animate-pulse" />
        </div>
        
        {/* Buttons Placeholder */}
        <div className="flex flex-row gap-3 md:gap-4">
          <div className="h-10 md:h-12 w-28 md:w-32 bg-zinc-800 rounded-md animate-pulse" />
          <div className="h-10 md:h-12 w-32 md:w-36 bg-zinc-800/50 rounded-md animate-pulse" />
        </div>
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

const Shimmer = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <MainContainerShimmer />
      <div className="mt-0 md:-mt-40 relative z-20 space-y-4">
        <MovieListShimmer title="Loading Movies..." />
        <MovieListShimmer title="Popular" />
        <MovieListShimmer title="Top Rated" />
      </div>
    </div>
  );
};

export default Shimmer;
