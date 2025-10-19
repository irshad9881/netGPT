import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utiles/fireBase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUser, removeUser } from "../utiles/userSlice";
import { LOGO, SUPPORTED_LAG } from "../utiles/constants";
import { setshowGptSearchPage } from "../utiles/gptSlice";
import { changeLanguage } from "../utiles/configSlice";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGPtlang = useSelector(store => store?.gpt?.showGptSearchPage);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setShowUserMenu(false);
    }).catch((error) => {
      navigate("/error");
    });
  };

  useEffect(() => {
    const unscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unscribed();
  }, []);

  const handleGptSearchPageClick = () => {
    dispatch(setshowGptSearchPage());
  };

  const handleLangChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-16 py-3 sm:py-4 md:py-6">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            className="h-5 sm:h-6 md:h-8 w-auto transition-transform duration-200 hover:scale-105" 
            src={LOGO} 
            alt="Netflix Logo" 
          />
        </div>

        {/* Navigation & User Menu */}
        {user && (
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
            {/* Language Selector */}
            {showGPtlang && (
              <select 
                onChange={handleLangChange}
                className="bg-black/50 text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none transition-colors backdrop-blur-sm"
              >
                {SUPPORTED_LAG.map(lang => (
                  <option key={lang.identifier} value={lang.identifier} className="bg-black">
                    {lang.name}
                  </option>
                ))}
              </select>
            )}

            {/* GPT Search Button */}
            <button 
              onClick={handleGptSearchPageClick}
              className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
            >
              <span className="hidden sm:inline">{showGPtlang ? "Home" : "AI Search"}</span>
              <span className="sm:hidden">{showGPtlang ? "Home" : "AI"}</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:bg-white/10 rounded-md p-2 transition-colors duration-200"
              >
                <img 
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md object-cover" 
                  src={user?.photoURL || '/default-avatar.png'} 
                  alt="Profile" 
                />
                <svg className={`w-4 h-4 text-white transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-black/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 py-2">
                  <div className="px-3 sm:px-4 py-2 border-b border-gray-700">
                    <p className="text-white font-medium text-xs sm:text-sm truncate">{user?.displayName}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-3 sm:px-4 py-2 text-white hover:bg-red-600/20 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;