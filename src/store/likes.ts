import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const url = "/likes";

interface ILike {
  likesCount: number;
  _id: string;
  userId: string;
  postId: string;
}

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
      likes.list.push(action.payload);
      likes.loading = false;
    },
  },
});

const {
  likesRequested,
  likesFailed,
  likesReceived,
  newLikeReceived,
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

export const getLikes = createSelector(
  (state: any) => state.entities.likes.list,
  (likes: ILike[]) => likes
);
