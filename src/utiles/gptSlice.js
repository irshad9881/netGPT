import { createSlice } from "@reduxjs/toolkit";

const gptSlice=createSlice({
    name:"gpt",
    initialState:{
        showGptSearchPage:false,
        moviesName:null,
        moviesResults:null,
        isFallback:false,
        isSearching:false,
        searchMissed:false,
    },
    reducers:{
        setshowGptSearchPage:(state,action)=>{
            state.showGptSearchPage=!state.showGptSearchPage;
        },
        setIsSearching:(state,action)=>{
            state.isSearching=action.payload;
            if (action.payload) {
                state.searchMissed=false;
            }
        },
        setSearchMissed:(state)=>{
            state.searchMissed=true;
            state.moviesName=null;
            state.moviesResults=null;
            state.isFallback=false;
            state.isSearching=false;
        },
        addGptMoviesResults:(state,action)=>{
            const {title,moviesResults,isFallback}=action.payload;
            state.moviesName=title;
            state.moviesResults=moviesResults;
            state.isFallback=isFallback || false;
            state.searchMissed=false;
            state.isSearching=false;
        }
    }
})
export const {setshowGptSearchPage,addGptMoviesResults,setIsSearching,setSearchMissed}=gptSlice.actions;
export default gptSlice.reducer;