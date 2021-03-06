import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { memoize } from "lodash";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import { deleteUploadedImages } from "../utils/utils";
import { IPost, IEditPost } from "../interfaces/posts";

const url = "/posts";

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
    },
    postDeleted: (posts, action: PayloadAction<IPost>) => {
      const { _id } = action.payload;
      const index = posts.list.findIndex((post: any) => post._id === _id);
      deleteUploadedImages(posts.list[index].postImages);
      posts.list.splice(index, 1);
      toast.dark("Post deleted!");
      posts.loading = false;
    },
    postEdited: (posts, action: PayloadAction<IPost>) => {
      const { _id } = action.payload;
      const index = posts.list.findIndex((post: IPost) => post._id === _id);
      posts.list[index] = action.payload;
      posts.loading = false;
      toast.dark("Post updated!");
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
  postEdited,
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
    onSuccess: postsLikesReceived.type,
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

export const editPost = (data: IEditPost) => {
  const { id } = data;
  return apiCallBegan({
    url: `${url}/${id}`,
    method: "PATCH",
    data,
    onStart: postsRequested.type,
    onSuccess: postEdited.type,
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

export const getUserPosts = createSelector(
  (state: any) => state.entities.posts.list,
  (posts: IPost[]) =>
    memoize((userId: string) =>
      posts.filter((post) => post.postedBy._id === userId)
    )
);

export const isLoading = createSelector(
  (state: any) => state.entities.posts,
  (posts: PostsSliceState) => posts.loading
);
