import { configureStore } from '@reduxjs/toolkit';
import subredditsReducer from '../features/subreddits/subredditsSlice';
import pageReducer from '../features/page/pageSlice';
import commentReducer from '../features/comment/commentSlice';

export const store = configureStore({
   reducer: {
    subreddits: subredditsReducer,
    page: pageReducer,
    comment: commentReducer,
   } 
});