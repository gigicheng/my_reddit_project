import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSubreddits = createAsyncThunk( // thunk action creator
    'subreddits/fetchSubreddits', // action type
    async() => { // payload creator
        const response = await fetch('https://www.reddit.com/subreddits/popular.json');
        const results = await response.json();
        console.log('fetchSubreddits:', results);
        // console.table(results);
        return results.data.children.map(item => item.data);
    }
);

const options = {
    name: 'subreddits',
    initialState: {
        list: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubreddits.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchSubreddits.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchSubreddits.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
};

const subredditsSlice = createSlice(options);

export default subredditsSlice.reducer;