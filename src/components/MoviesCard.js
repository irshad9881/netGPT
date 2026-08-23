import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IMG_CDN_URL } from "../utiles/constants";
import { setSelectedMovie } from "../utiles/movisesSlice";
import { setshowGptSearchPage } from "../utiles/gptSlice";

const MovieCard = ({ movie, className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showGptSearchPage = useSelector(store => store?.gpt?.showGptSearchPage);

  const handleMovieClick = () => {
    // Set selected movie
    dispatch(setSelectedMovie(movie));
    
    // If on search page, navigate to browse page
    if (showGptSearchPage) {
      dispatch(setshowGptSearchPage()); // Toggle off search page
      navigate('/browse');
    }
    
    // Netflix-style smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Add loading state with delay for smooth transition
    const card = document.activeElement;
    if (card) {
      card.style.transform = 'scale(0.95)';
      card.style.opacity = '0.7';
    }
    
    setTimeout(() => {
      if (card) {
        card.style.transform = '';
        card.style.opacity = '';
      }
    }, 200);
  };
  if (!movie?.poster_path) {
    return (
      <div className={`w-28 sm:w-32 md:w-40 lg:w-48 h-42 sm:h-48 md:h-60 lg:h-72 bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
      </div>
    );
  }

  return (
    <div className={`group cursor-pointer transform transition-all duration-300 hover:z-20 ${className}`} onClick={handleMovieClick}>
      <div className="relative w-28 sm:w-32 md:w-40 lg:w-48 h-42 sm:h-48 md:h-60 lg:h-72 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <img 
          src={IMG_CDN_URL + movie.poster_path} 
          alt={movie.title || movie.name || "Movie poster"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          width="192"
          height="288"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-2 sm:p-3 md:p-4 text-white">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base line-clamp-2">
              {movie.title || movie.name}
            </h3>
            {movie.vote_average && (
              <div className="flex items-center mt-1 sm:mt-2">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs ml-1">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Rating badge */}
        {movie.vote_average && (
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/80 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;