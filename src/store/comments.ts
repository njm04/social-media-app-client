import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { memoize } from "lodash";
import { toast } from "react-toastify";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import { IComment, IEditComment } from "../interfaces/comments";

const url = "/comments";

interface CommentsSliceState {
  list: IComment[];
  loading: boolean;
  isError: boolean;
}

const initialState: CommentsSliceState = {
  list: [],
  loading: false,
  isError: false,
};

const slice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    commentsRequested: (comments, action) => {
      comments.loading = true;
      comments.isError = false;
    },
    commentsFailed: (comments, action) => {
      comments.isError = action.type === "comments/commentsFailed";
      comments.loading = false;
    },
    commentsReceived: (comments, action: PayloadAction<IComment[]>) => {
      comments.list = action.payload;
      comments.loading = false;
      comments.isError = false;
    },
    newCommentReceived: (comments, action: PayloadAction<IComment>) => {
      comments.list.push(action.payload);
      comments.loading = false;
      comments.isError = false;
    },
    commentDeleted: (comments, action: PayloadAction<IComment>) => {
      const { _id } = action.payload;
      const index = comments.list.findIndex(
        (comment: any) => comment._id === _id
      );
      comments.list.splice(index, 1);
      toast.dark("You've deleted your comment.");
      comments.loading = false;
    },
    commentEdited: (comments, action: PayloadAction<IComment>) => {
      const { _id } = action.payload;
      const index = comments.list.findIndex(
        (comment: any) => comment._id === _id
      );
      comments.list[index] = action.payload;
      comments.loading = false;
      toast.dark("You've updated your comment.");
    },
  },
});

const {
  commentsRequested,
  commentsFailed,
  commentsReceived,
  newCommentReceived,
  commentDeleted,
  commentEdited,
} = slice.actions;
export default slice.reducer;

export const loadComments = (postId: string) => {
  return apiCallBegan({
    url: `${url}/${postId}`,
    method: "GET",
    onStart: commentsRequested.type,
    onSuccess: commentsReceived.type,
    onError: commentsFailed.type,
  });
};

export const createComment = (comment: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data: comment,
    onStart: commentsRequested.type,
    onSuccess: newCommentReceived.type,
    onError: commentsFailed.type,
  });
};

export const deleteComment = (id: string) => {
  return apiCallBegan({
    url: `${url}/${id}`,
    method: "DELETE",
    onStart: commentsRequested.type,
    onSuccess: commentDeleted.type,
    onError: commentsFailed.type,
  });
};

export const editComment = (data: IEditComment) => {
  const { id } = data;
  return apiCallBegan({
    url: `${url}/${id}`,
    method: "PATCH",
    data,
    onStart: commentsRequested.type,
    onSuccess: commentEdited.type,
    onError: commentsFailed.type,
  });
};

export const getComments = createSelector(
  (state: any) => state.entities.comments.list,
  (comments: IComment[]) =>
    memoize((postId: string) => {
      return comments.filter((comment) => comment.post === postId);
    })
);

export const didCommentFailed = createSelector(
  (state: any) => state.entities.comments,
  (comments: CommentsSliceState) => comments.isError
);

export const getSingleComment = createSelector(
  (state: any) => state.entities.comments.list,
  (comments: IComment[]) =>
    memoize((id: string) => {
      return comments.find((comment) => comment._id === id);
    })
);

export const isLoading = createSelector(
  (state: any) => state.entities.comments,
  (comments: CommentsSliceState) => comments.loading
);
