import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: null,
    nowMovieTrailer: null,
    popularMovies: null,
    tvSeriesMovies: null,
    comedyMovies: null,
    selectedMovie: null,
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = action?.payload;
    },
    addMovieTrailer: (state, action) => {
      state.nowMovieTrailer = action?.payload;
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = action?.payload;
    },
    addTvSeries: (state, action) => {
      state.tvSeriesMovies = action?.payload;
    },
    addComedyMovies: (state, action) => {
      state.comedyMovies = action?.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action?.payload;
    },
  },
});

export const {
  addNowPlayingMovies,
  addMovieTrailer,
  addPopularMovies,
  addTvSeries,
  addComedyMovies,
  setSelectedMovie,
} = moviesSlice.actions;
export default moviesSlice.reducer;
