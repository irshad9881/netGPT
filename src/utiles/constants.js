export const LOGO = "/logo.svg";

export const URL_LOGIN =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShC7CDrniEZDUN1pO49xLMm1qPd_zd3smFdug0d0mk-_ZoDP40Hj8L5wKimQVCOeDSsr8&usqp=CAU";

export const LOGIN_BG =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2560&q=80";

// Posters are public TMDB CDN. Movie JSON and Gemini now go through NetGPT-Backend
// (/api/media/*) so TMDB/Gemini secrets stay in the API .env, not in React.
export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w185";

export const SUPPORTED_LAG = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "bangla", name: "Bangla" },
];
