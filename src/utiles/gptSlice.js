import { createSlice } from "@reduxjs/toolkit";

const gptSlice=createSlice({
    name:"gpt",
    initialState:{
        showGptSearchPage:false,
        moviesName:null,
        moviesResults:null,
        isFallback:false,
        isSearching:false,
    },
    reducers:{
        setshowGptSearchPage:(state,action)=>{
            state.showGptSearchPage=!state.showGptSearchPage;
        },
        setIsSearching:(state,action)=>{
            state.isSearching=action.payload;
        },
        addGptMoviesResults:(state,action)=>{
            const {title,moviesResults,isFallback}=action.payload;
            state.moviesName=title;
            state.moviesResults=moviesResults;
            state.isFallback=isFallback || false;
            state.isSearching=false;
        }
    }
})
export const {setshowGptSearchPage,addGptMoviesResults,setIsSearching}=gptSlice.actions;
export default gptSlice.reducer;