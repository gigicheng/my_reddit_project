import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPage = createAsyncThunk( // thunk action creator
    'page/fetchPage', // action type
    async(subredditUrl) => { // payload creator
        const response = await fetch(`https://www.reddit.com${subredditUrl}.json`);
        const results = await response.json();
        console.log('fetchPage:', results);
        return results.data.children.map(item => item.data);
    }
);

const options = {
    name: 'page',
    initialState: {
        selectedSubredditUrl: '/r/Home/',
        posts: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPage.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchPage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
                state.selectedSubredditUrl = action.meta.arg; 
                    // action.meta.arg 是指呼叫 thunk 時傳入的參數，也就是 subredditUrl
                    // 在這裡是將目前點擊到的 subreddit 的 url (subredditUrl) 設為 selectedSubredditUrl
                console.log('selectedSubredditUrl:', action.meta.arg);
            })
            .addCase(fetchPage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
};

export const pageSlice = createSlice(options);

export default pageSlice.reducer;