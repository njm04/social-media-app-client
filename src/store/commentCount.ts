import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const url = "/comments";

export interface ICommentsCount {
  _id?: string;
  postId?: string;
  count?: number;
}

interface CommentsSliceState {
  commentsCount: ICommentsCount;
  list: ICommentsCount[];
  loading: boolean;
}

const initialState: CommentsSliceState = {
  commentsCount: {},
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "commentsCount",
  initialState,
  reducers: {
    countRequested: (comments, action) => {
      comments.loading = true;
    },
    countFailed: (comments, action) => {
      comments.loading = false;
    },
    countReceived: (comments, action: PayloadAction<ICommentsCount[]>) => {
      comments.list = action.payload;
      comments.loading = false;
    },
  },
});

const { countRequested, countFailed, countReceived } = slice.actions;
export default slice.reducer;

// export const loadCommentsCount = (postId: string) => {
//   return apiCallBegan({
//     url: `${url}/count/${postId}`,
//     method: "GET",
//     onStart: countRequested.type,
//     onSuccess: countReceived.type,
//     onError: countFailed.type,
//   });
// };

export const loadCommentsCount = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: countRequested.type,
    onSuccess: countReceived.type,
    onError: countFailed.type,
  });
};

export const getCount = createSelector(
  (state: any) => state.entities.commentsCount.list,
  (commentsCount: ICommentsCount[]) => commentsCount
);
