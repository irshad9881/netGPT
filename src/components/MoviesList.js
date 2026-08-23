import { useState, useRef } from "react";
import MovieCard from "./MoviesCard";
import { MovieListShimmer } from "./Shimmer";

const MoviesList = ({ title, movies }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef(null);

  if (movies === null) {
    return <MovieListShimmer title={title} />;
  }

  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="text-gray-400 text-center py-8">
          No movies available
        </div>
      </div>
    );
  }

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  return (
    <section className="group px-4 py-6 bg-gradient-to-r from-black/30 to-transparent hover:from-black/50 transition-all duration-300">
      <h2 className="text-xl md:text-3xl font-bold text-white mb-6 tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            aria-label={`Scroll ${title} left`}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            aria-label={`Scroll ${title} right`}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Movies Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-12"
        >
          {Array.isArray(movies) && movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              className="flex-shrink-0 transform transition-transform duration-300 hover:z-10"
            />
          ))}
        </div>
        
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none z-40" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none z-40" />
      </div>
    </section>
  );
};

export default MoviesList;