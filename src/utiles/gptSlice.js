import { createSlice } from "@reduxjs/toolkit";

const gptSlice=createSlice({
    name:"gpt",
    initialState:{
        showGptSearchPage:false,
        moviesName:null,
        moviesResults:null,
        isFallback:false,
    },
    reducers:{
        setshowGptSearchPage:(state,action)=>{
            state.showGptSearchPage=!state.showGptSearchPage;
        },
        addGptMoviesResults:(state,action)=>{
            const {title,moviesResults,isFallback}=action.payload;
            state.moviesName=title;
            state.moviesResults=moviesResults;
            state.isFallback=isFallback || false;
        }
    }
})
export const {setshowGptSearchPage,addGptMoviesResults}=gptSlice.actions;
export default gptSlice.reducer;