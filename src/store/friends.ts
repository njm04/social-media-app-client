import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { memoize } from "lodash";
import { IFriendRequest, IIsFriends } from "../interfaces/friends";
import { apiCallBegan } from "./api";

const url = "/friends";

interface FriendSliceState {
  list: IFriendRequest[];
  loading: boolean;
}

const initialState: FriendSliceState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    friendsRequested: (friends, action) => {
      friends.loading = true;
    },
    friendsRequestFailed: (friends, action) => {
      friends.loading = false;
    },
    friendsReceived: (friends, action: PayloadAction<IFriendRequest[]>) => {
      friends.list = action.payload;
      friends.loading = false;
    },
    addFriendRequested: (friends, action: PayloadAction<IFriendRequest>) => {
      friends.list.push(action.payload);
      friends.loading = false;
    },
    friendRequestCancelled: (
      friends,
      action: PayloadAction<IFriendRequest>
    ) => {
      const { _id } = action.payload;
      const index = friends.list.findIndex((request) => request._id === _id);
      friends.list.splice(index, 1);
      friends.loading = false;
    },
  },
});

const {
  friendsRequested,
  friendsRequestFailed,
  addFriendRequested,
  friendsReceived,
  friendRequestCancelled,
} = slice.actions;
export default slice.reducer;

interface IAddFriend {
  requester: string;
  recipient: string;
  status: string;
}

export const loadFriends = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: friendsRequested.type,
    onSuccess: friendsReceived.type,
    onError: addFriendRequested.type,
  });
};

export const addFriend = (data: IAddFriend) => {
  return apiCallBegan({
    url,
    method: "POST",
    data,
    onStart: friendsRequested.type,
    onSuccess: addFriendRequested.type,
    onError: friendsRequestFailed.type,
  });
};

export const cancelFriendRequest = (id: string) => {
  return apiCallBegan({
    url: `${url}/${id}`,
    method: "DELETE",
    onStart: friendsRequested.type,
    onSuccess: friendRequestCancelled.type,
    onError: friendsRequestFailed.type,
  });
};

export const isFriends = createSelector(
  (state: any) => state.entities.friends.list,
  (friends: IFriendRequest[]) =>
    memoize((data: IIsFriends) =>
      friends.find(
        (friend) =>
          friend.requester === data.requester &&
          friend.recipient === data.recipient
      )
    )
);

export const isCancelled = createSelector(
  (state: any) => state.entities.friends.list,
  (friends: IFriendRequest[]) =>
    memoize((id: string) => friends.find((friend) => friend._id === id))
);
