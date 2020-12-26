import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const url = "/posts";

interface IPostedBy {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface IPostImages {
  name: string;
  url: string;
}

export interface IPost {
  _id: string;
  post: string;
  postedBy: IPostedBy;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  postImages: IPostImages[];
}

interface PostsSliceState {
  list: IPost[];
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
    newPostReceived: (posts, action: PayloadAction<IPost>) => {
      posts.list.push(action.payload);
      posts.loading = false;
    },
    postsReceived: (posts, action: PayloadAction<IPost[]>) => {
      posts.list = action.payload;
      posts.loading = false;
    },
    postCommentIncremented: (
      posts,
      action: PayloadAction<{ post: string }>
    ) => {
      const { post: postId } = action.payload;
      const index = posts.list.findIndex((post: any) => post._id === postId);
      posts.list[index].commentCount += 1;
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

export const { postCommentIncremented } = slice.actions;
export default slice.reducer;

export const createPost = (post: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data: post,
    onStart: postsRequested.type,
    onSuccess: newPostReceived.type,
    onError: postsFailed.type,
  });
};

export const loadPosts = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: postsRequested.type,
    onSuccess: postsReceived.type,
    onError: postsFailed.type,
  });
};

export const getAllPosts = createSelector(
  (state: any) => state.entities.posts.list,
  (posts: IPost[]) => posts
);
