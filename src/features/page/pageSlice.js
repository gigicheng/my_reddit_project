import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPage = createAsyncThunk( // thunk action creator
    'page/fetchPage', // action type
    async(_, {getState}) => { // payload creator
        const {page} = getState();
        const {searchTerm, selectedSubredditUrl} = page;
        let url = '';
        if (searchTerm.trim() !== '') {
            url = `https://www.reddit.com/search.json?q=${searchTerm}`;
          } else if (selectedSubredditUrl) {
            url = `https://www.reddit.com${selectedSubredditUrl}.json`;
          } else {
            url = 'https://www.reddit.com/r/Home.json';
          }

        const response = await fetch(url);
        const results = await response.json();
        console.log(`fetchPage:`, results)
        return {
            posts: results.data.children.map(item => item.data),
            source: searchTerm ? 'search' : 'subreddit'
          };   
    }
);

const options = {
    name: 'page',
    initialState: {
        selectedSubredditUrl: '/r/Home/',
        source: '',
        searchTerm: '',
        posts: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setSelectedSubredditUrl(state, action) {
            state.selectedSubredditUrl = action.payload;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPage.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchPage.fulfilled, (state, action) => {
                const { posts, source } = action.payload;
                state.status = 'succeeded';
                state.posts = posts;
                state.source = source;
                // state.selectedSubredditUrl = action.meta.arg.subredditUrl;
                // state.searchTerm = action.meta.arg.searchTerm;
                    // action.meta.arg 是指呼叫 thunk 時傳入的參數，也就是 subredditUrl
                    // 在這裡是將目前點擊到的 subreddit 的 url (subredditUrl) 設為 selectedSubredditUrl
                // console.log('selectedSubredditUrl:', action.meta.arg.subredditUrl);
                // console.log('searchTerm:', action.meta.arg.searchTerm)
            })
            .addCase(fetchPage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
};

export const pageSlice = createSlice(options);

export const { setSearchTerm, setSelectedSubredditUrl } = pageSlice.actions;

export default pageSlice.reducer;