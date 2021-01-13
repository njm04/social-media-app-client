import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { memoize } from "lodash";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import { ILike } from "../interfaces/likes";

const url = "/likes";

interface LikesSliceState {
  list: ILike[];
  loading: boolean;
}

const initialState: LikesSliceState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    likesRequested: (likes, action) => {
      likes.loading = true;
    },
    likesFailed: (likes, action) => {
      likes.loading = false;
    },
    likesReceived: (likes, action: PayloadAction<ILike[]>) => {
      likes.list = action.payload;
      likes.loading = false;
    },
    newLikeReceived: (likes, action: PayloadAction<ILike>) => {
      const { userId, postId } = action.payload;
      const index = likes.list.findIndex(
        (like: any) => like.postId === postId && like.userId === userId
      );

      if (index === -1) likes.list.push(action.payload);
      likes.loading = false;
    },
    likeDeleted: (likes, action) => {
      const { _id } = action.payload;
      const index = likes.list.findIndex((like) => like._id === _id);
      likes.list.splice(index, 1);
      likes.loading = false;
    },
  },
});

const {
  likesRequested,
  likesFailed,
  likesReceived,
  newLikeReceived,
  likeDeleted,
} = slice.actions;
export default slice.reducer;

export const loadLikes = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: likesRequested.type,
    onSuccess: likesReceived.type,
    onError: likesFailed.type,
  });
};

export const addLike = (data: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data,
    onStart: likesRequested.type,
    onSuccess: newLikeReceived.type,
    onError: likesFailed.type,
  });
};

export const deleteLike = (data: object) => {
  return apiCallBegan({
    url,
    method: "DELETE",
    data,
    onStart: likesRequested.type,
    onSuccess: likeDeleted.type,
    onError: likesFailed.type,
  });
};

export const getAllPostsLikes = createSelector(
  (state: any) => state.entities.likes.list,
  (likes: ILike[]) => likes
);

interface IGetPostLikeArgs {
  userId: string | undefined | null;
  postId: string;
}
export const getPostLike = createSelector(
  (state: any) => state.entities.likes.list,
  (likes: ILike[]) =>
    memoize((data: IGetPostLikeArgs) =>
      likes.filter(
        (like: ILike) =>
          like.userId === data.userId && like.postId === data.postId
      )
    )
);

export const deletePostLike = createSelector(
  (state: any) => state.entities.likes.list,
  (likes: ILike[]) =>
    memoize((data: IGetPostLikeArgs) =>
      likes.filter(
        (like: ILike) =>
          like.userId !== data.userId && like.postId !== data.postId
      )
    )
);
