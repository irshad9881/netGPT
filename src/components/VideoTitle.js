
import { useState, useEffect } from 'react';

const VideoTitle = ({ title, overview }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlay = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (isPlaying) {
        // Pause video by changing src to remove autoplay
        const currentSrc = iframe.src;
        iframe.src = currentSrc.replace('&autoplay=1', '&autoplay=0');
        setIsPlaying(false);
      } else {
        // Play video by adding autoplay
        const currentSrc = iframe.src;
        iframe.src = currentSrc.replace('&autoplay=0', '&autoplay=1');
        setIsPlaying(true);
      }
    }
  };

  const handleMoreInfo = () => {
    // Simulate Netflix more info modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-gray-900 p-8 rounded-lg max-w-2xl mx-4 text-white">
        <h2 class="text-2xl font-bold mb-4">${title}</h2>
        <p class="text-gray-300 mb-6">${overview}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold transition-colors">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  };

  const handleMyList = () => {
    // Simulate add to list functionality
    const isInList = localStorage.getItem(`mylist_${title}`);
    if (isInList) {
      localStorage.removeItem(`mylist_${title}`);
      alert(`Removed "${title}" from My List`);
    } else {
      localStorage.setItem(`mylist_${title}`, 'true');
      alert(`Added "${title}" to My List`);
    }
  };

  return (
    <>
      {/* Mobile: Floating buttons at bottom */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="flex gap-3">
          <button 
            onClick={handlePlay}
            className="bg-white/90 hover:bg-white text-black font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-xl backdrop-blur-sm flex-1"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
            <span className="text-sm font-semibold">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <button 
            onClick={handleMoreInfo}
            className="bg-black/70 hover:bg-black/90 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-xl backdrop-blur-sm flex-1"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span className="text-sm">Info</span>
          </button>
          
          <button 
            onClick={handleMyList}
            className="bg-black/50 border-2 border-white/60 hover:border-white hover:bg-black/70 text-white font-semibold py-3 px-3 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-xl backdrop-blur-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: Normal layout */}
      <div className="hidden sm:block pt-[18%] md:pt-[15%] lg:pt-[20%] w-screen px-6 md:px-12 lg:px-24 absolute text-white  z-10 max-w-full overflow-hidden">
        <div className="max-w-md md:max-w-lg lg:max-w-xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 text-gray-200 drop-shadow line-clamp-3 lg:line-clamp-none">
            {overview}
          </p>
          
          <div className="flex flex-row gap-3 md:gap-4">
            {/* Desktop Play/Pause Button */}
            <button 
              onClick={handlePlay}
              className="group bg-white hover:bg-gray-200 text-black font-bold py-2 md:py-3 px-6 md:px-8 rounded-md flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
              <span className="text-sm md:text-lg font-semibold">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            {/* Desktop More Info Button */}
            <button 
              onClick={handleMoreInfo}
              className="group bg-gray-600/70 hover:bg-gray-600/90 text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-md flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg backdrop-blur-sm"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span className="text-sm md:text-lg">More Info</span>
            </button>
            
            {/* Desktop My List Button */}
            <button 
              onClick={handleMyList}
              className="group bg-transparent border-2 border-gray-400 hover:border-white text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-md flex items-center justify-center transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default VideoTitle;
