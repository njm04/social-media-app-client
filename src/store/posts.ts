import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { isEmpty } from "lodash";
import { apiCallBegan } from "./api";

const url = "/posts";

export interface IPost {
  _id: string;
  post: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsSliceState {
  list: object[];
  loading: boolean;
}

const initialState: PostsSliceState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postsRequested: (posts, action) => {
      posts.loading = true;
    },
    postsFailed: (posts, action) => {
      posts.loading = false;
    },
    newPostReceived: (posts, action: PayloadAction<object>) => {
      posts.list.push(action.payload);
      posts.loading = false;
    },
    postsReceived: (posts, action: PayloadAction<object[]>) => {
      posts.list = action.payload;
      posts.loading = false;
    },
  },
});

const {
  postsRequested,
  postsFailed,
  newPostReceived,
  postsReceived,
} = slice.actions;
export default slice.reducer;

export const createPost = (post: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data: post,
    onStart: postsRequested.type,
    onSuccess: newPostReceived.type,
    onFailure: postsFailed.type,
  });
};

export const loadPosts = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: postsRequested.type,
    onSuccess: postsReceived.type,
    onFailure: postsFailed.type,
  });
};

export const getAllPosts = createSelector(
  (state: any) => state.entities.posts.list,
  (posts: IPost[]) => posts
);
