
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ moveiId }) => {
    const [isMuted, setIsMuted] = useState(true);
    const iframeRef = useRef(null);
    const trailerVideo = useSelector(store => store?.movies?.nowMovieTrailer);

    useMovieTrailer(moveiId);

    const toggleMute = () => {
        if (iframeRef.current) {
            const command = isMuted ? 'unMute' : 'mute';
            iframeRef.current.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: command, args: [] }),
                '*'
            );
            if (isMuted) {
                iframeRef.current.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
                    '*'
                );
            }
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="w-screen aspect-video relative bg-black">
            <iframe
                ref={iframeRef}
                className="w-screen aspect-video pt-12 md:pt-0"
                src={`https://www.youtube.com/embed/${trailerVideo?.key}?autoplay=1&mute=1&enablejsapi=1&controls=0&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            >
            </iframe>

            {/* Netflix-style Mute / Unmute Button */}
            {trailerVideo?.key && (
                <div className="absolute right-4 sm:right-8 md:right-16 bottom-16 sm:bottom-24 md:bottom-36 z-30">
                    <button
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                        title={isMuted ? "Unmute" : "Mute"}
                        className="p-2.5 sm:p-3 md:p-3.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/40 hover:border-white text-white backdrop-blur-md transition-all duration-300 transform hover:scale-110 shadow-2xl flex items-center justify-center group focus:outline-none"
                    >
                        {isMuted ? (
                            /* Muted Icon */
                            <svg className="w-5 h-5 md:w-6 md:h-6 fill-current text-white/90 group-hover:text-white" viewBox="0 0 24 24">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        ) : (
                            /* Unmuted Icon */
                            <svg className="w-5 h-5 md:w-6 md:h-6 fill-current text-white/90 group-hover:text-white" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoBackground;