import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComment = createAsyncThunk(
    'comment/fetchComment',
    async(postPermalink) => {
        const response = await fetch(`https://www.reddit.com${postPermalink}.json`);
        const results = await response.json();
        return results[1].data.children.map(item => item.data);
    }
)

const options = {
    name: 'comment',
    initialState: {
        comments: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComment.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = action.payload;
            })
            .addCase(fetchComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
};

export const commentSlice = createSlice(options);

export default commentSlice.reducer;