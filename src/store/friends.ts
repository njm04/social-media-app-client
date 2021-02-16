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
  },
});

const {
  friendsRequested,
  friendsRequestFailed,
  addFriendRequested,
  friendsReceived,
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

export const cancelFriendRequest = (data: IAddFriend) => {
  return apiCallBegan({
    url,
    method: "DELETE",
    data,
    onStart: friendsRequested.type,
    onSuccess: addFriendRequested.type,
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
