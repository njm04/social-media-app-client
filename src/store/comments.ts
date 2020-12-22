import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { memoize } from "lodash";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const url = "/comments";

interface ICreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface IComment {
  _id: string;
  post: string;
  comment: string;
  createdBy: ICreatedBy;
  createdAt: string;
}

interface CommentsSliceState {
  list: IComment[];
  loading: boolean;
}

const initialState: CommentsSliceState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    commentsRequested: (comments, action) => {
      comments.loading = true;
    },
    commentsFailed: (comments, action) => {
      comments.loading = false;
    },
    commentsReceived: (comments, action: PayloadAction<IComment[]>) => {
      comments.list = action.payload;
      console.log(comments.list);
      comments.loading = false;
    },
    newCommentReceived: (comments, action: PayloadAction<IComment>) => {
      comments.list.push(action.payload);
      comments.loading = false;
    },
  },
});

const {
  commentsRequested,
  commentsFailed,
  commentsReceived,
  newCommentReceived,
} = slice.actions;
export default slice.reducer;

export const loadComments = (postId: string) => {
  return apiCallBegan({
    url: `${url}/${postId}`,
    method: "GET",
    onStart: commentsRequested.type,
    onSuccess: commentsReceived.type,
    onFailure: commentsFailed.type,
  });
};

export const createComment = (comment: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data: comment,
    onStart: commentsRequested.type,
    onSuccess: newCommentReceived.type,
    onFailure: commentsFailed.type,
  });
};

export const getComments = createSelector(
  (state: any) => state.entities.comments.list,
  (comments: IComment[]) =>
    memoize((postId: string) => {
      return comments.filter((comment) => comment.post === postId);
    })
);
