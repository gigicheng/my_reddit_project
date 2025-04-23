import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSearch = createAsyncThunk(
    'search/fetchSearch',
    async(term) => {
        const response = await fetch(`https://www.reddit.com/search.json?q=${term}`);
        const results = await response.json();
        console.log(`fetchSearch:`, results)
        return results.data.cildren.map(item => item.data);

    }
);

const options = {
    name: 'search',
    initialState: {
        term: '',
        searchResults: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setSearchTerm(state, action) {
            state.term = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearch.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.searchResults = action.payload;
                state.term = action.meta.arg;
            })
            .addCase(fetchSearch.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
};

export const searchSlice = createSlice(options);

export const { setSearchTerm } = searchSlice.actions;

export default searchSlice.reducer;