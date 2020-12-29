import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { memoize } from "lodash";
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
  likes: number;
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
    postsLikesReceived: (posts, action: PayloadAction<IPost>) => {
      const { _id } = action.payload;
      const index = posts.list.findIndex((post: any) => post._id === _id);
      posts.list[index].likes = action.payload.likes;
      posts.loading = false;
    },
    postDeleted: (posts, action: PayloadAction<IPost>) => {
      const { _id } = action.payload;
      const index = posts.list.findIndex((post: any) => post._id === _id);
      posts.list.splice(index, 1);
      toast.dark("Post deleted!");
      posts.loading = false;
    },
  },
});

const {
  postsRequested,
  postsFailed,
  newPostReceived,
  postsReceived,
  postsLikesReceived,
  postDeleted,
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

export const likePost = (data: object) => {
  return apiCallBegan({
    url: `${url}/like`,
    method: "POST",
    data,
    onStart: postsRequested.type,
    onSuccess: postsLikesReceived.type,
    onError: postsFailed.type,
  });
};

export const deletePost = (id: string) => {
  return apiCallBegan({
    url: `${url}/${id}`,
    method: "DELETE",
    onStart: postsRequested.type,
    onSuccess: postDeleted.type,
    onError: postsFailed.type,
  });
};

export const getAllPosts = createSelector(
  (state: any) => state.entities.posts.list,
  (posts: IPost[]) => posts
);

export const getPost = createSelector(
  (state: any) => state.entities.posts.list,
  (posts: IPost[]) =>
    memoize((postId: string) => posts.find((post) => post._id === postId))
);
