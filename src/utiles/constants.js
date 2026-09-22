export const LOGO = "/logo.svg";

export const URL_LOGIN="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShC7CDrniEZDUN1pO49xLMm1qPd_zd3smFdug0d0mk-_ZoDP40Hj8L5wKimQVCOeDSsr8&usqp=CAU"

export const LOGIN_BG = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80";

export const   API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer '+process.env.REACT_APP_TMDB_KEY,
    }
  };
  
  export const IMG_CDN_URL="https://image.tmdb.org/t/p/w185";
  
  export const SUPPORTED_LAG=[
  {identifier:"en",name:"English"},
  {identifier:"hindi",name:"Hindi"},
  {identifier:"bangla",name:"Bangla"},
]

export const GEMINI_KEY=process.env.REACT_APP_GEMINI_API_KEY;
export const TMDB_SEARCH_API_URL=process.env.REACT_APP_TMDB_SEARCH_API_URL || "https://api.themoviedb.org/3/search/movie";
export const TMDB_API_URL=process.env.REACT_APP_TMDB_API_URL || "https://api.themoviedb.org";