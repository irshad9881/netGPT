// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../utiles/fireBase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { addUser, removeUser } from "../utiles/userSlice";
import { SUPPORTED_LAG } from "../utiles/constants";
import { setshowGptSearchPage } from "../utiles/gptSlice";
import { changeLanguage } from "../utiles/configSlice";
import {
  logoutCurrentSession,
  refreshAuthSession,
  restoreCurrentUser,
} from "../utiles/auth-api";
import { toStoreUser } from "../utiles/to-store-user";

const SESSION_REFRESH_MS = 12 * 60 * 1000;

const profileInitials = (user) => {
  const source = user?.displayName?.trim() || user?.email?.trim() || "U";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGPtlang = useSelector(store => store?.gpt?.showGptSearchPage);
  const profilePhoto = user?.photoURL || "/user.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setPhotoFailed(false);
  }, [user?.photoURL]);

  useEffect(() => {
    if (!showUserMenu) return;
    const closeMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [showUserMenu]);

  const handleSignOut = () => {
    // signOut(auth).then(() => {
    //   setShowUserMenu(false);
    // }).catch((error) => {
    //   navigate("/error");
    // });
    logoutCurrentSession()
      .catch(() => {})
      .finally(() => {
        setShowUserMenu(false);
        dispatch(removeUser());
        navigate("/");
      });
  };

  useEffect(() => {
    // const unscribed = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     const { uid, email, displayName, photoURL } = user;
    //     dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }));
    //     navigate("/browse");
    //   } else {
    //     dispatch(removeUser());
    //     navigate("/");
    //   }
    // });
    // return () => unscribed();

    let isMounted = true;
    let refreshTimer;

    const keepSession = ({ user }) => {
      dispatch(addUser(toStoreUser(user)));
      navigate("/browse");
    };

    restoreCurrentUser()
      .then((payload) => {
        if (!isMounted) return;
        keepSession(payload);
        refreshTimer = setInterval(() => {
          refreshAuthSession().catch(() => {
            if (!isMounted) return;
            dispatch(removeUser());
            navigate("/");
          });
        }, SESSION_REFRESH_MS);
      })
      .catch(() => {
        if (isMounted) {
          dispatch(removeUser());
          navigate("/");
        }
      });

    return () => {
      isMounted = false;
      if (refreshTimer) clearInterval(refreshTimer);
    };
    // Session bootstrap on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex items-center justify-between gap-3 px-3 sm:px-6 md:px-10 lg:px-16 py-2 sm:py-3">
        <div className="flex min-w-0 items-center">
          <span
            className="text-[#E50914] text-[1.5rem] sm:text-4xl leading-none select-none tracking-wide"
            style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif" }}
            aria-label="Netfilix-AI"
          >
            NETFILIX-AI
          </span>
        </div>

        {user && (
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            {showGPtlang && (
              <select
                onChange={handleLangChange}
                className="hidden sm:block max-w-[7.5rem] bg-black/60 text-white text-sm px-2 py-1.5 rounded border border-white/20 focus:border-red-500 focus:outline-none"
              >
                {SUPPORTED_LAG.map(lang => (
                  <option key={lang.identifier} value={lang.identifier} className="bg-black">
                    {lang.name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handleGptSearchPageClick}
              className="whitespace-nowrap rounded bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 sm:px-3 sm:text-sm"
            >
              <span className="hidden sm:inline">{showGPtlang ? "Home" : "AI Search"}</span>
              <span className="sm:hidden">{showGPtlang ? "Home" : "AI"}</span>
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 rounded p-0.5 pr-1 hover:bg-white/10"
              >
                {photoFailed ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#E50914] text-xs font-semibold text-white">
                    {profileInitials(user)}
                  </span>
                ) : (
                  <img
                    className="h-8 w-8 shrink-0 rounded object-cover"
                    src={profilePhoto}
                    alt=""
                    onError={() => setPhotoFailed(true)}
                  />
                )}
                <svg
                  className={`h-3.5 w-3.5 shrink-0 text-white/80 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showUserMenu && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-white/10 bg-zinc-900/95 py-2 shadow-2xl"
                >
                  <div className="flex items-center gap-3 px-3 pb-2 mb-1 border-b border-white/10">
                    {photoFailed ? (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#E50914] text-xs font-semibold text-white">
                        {profileInitials(user)}
                      </span>
                    ) : (
                      <img
                        className="h-9 w-9 shrink-0 rounded object-cover"
                        src={profilePhoto}
                        alt=""
                        onError={() => setPhotoFailed(true)}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {user?.displayName || "Account"}
                      </p>
                      <p className="truncate text-xs text-zinc-400">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                  >
                    Log out
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