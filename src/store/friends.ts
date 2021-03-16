import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { memoize } from "lodash";
import {
  IFriendRequest,
  IIsFriends,
  IAcceptedFriend,
} from "../interfaces/friends";
import { apiCallBegan } from "./api";

const url = "/friends";

interface FriendSliceState {
  list: IFriendRequest[];
  acceptedFriends: IAcceptedFriend[];
  notifications: IFriendRequest[];
  loading: boolean;
}

const initialState: FriendSliceState = {
  list: [],
  acceptedFriends: [],
  notifications: [],
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
    acceptedFriendsReceived: (
      friends,
      action: PayloadAction<IAcceptedFriend[]>
    ) => {
      friends.acceptedFriends = action.payload;
      friends.loading = false;
    },
    friendRequestNotificationsReceived: (
      friends,
      action: PayloadAction<IFriendRequest[]>
    ) => {
      friends.notifications = action.payload;
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
      const requestNotifIndex = friends.notifications.findIndex(
        (request) => request._id === _id
      );
      friends.notifications.splice(requestNotifIndex, 1);
      friends.loading = false;
    },
    friendRequestResponse: (friends, action: PayloadAction<IFriendRequest>) => {
      const { _id } = action.payload;
      const index = friends.list.findIndex((request) => request._id === _id);
      friends.list[index] = action.payload;
      const requestNotifIndex = friends.notifications.findIndex(
        (request) => request._id === _id
      );
      friends.notifications[requestNotifIndex] = action.payload;
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
  friendRequestNotificationsReceived,
  friendRequestResponse,
  acceptedFriendsReceived,
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

export const loadAcceptedFriends = () => {
  return apiCallBegan({
    url: `${url}/accepted`,
    method: "GET",
    onStart: friendsRequested.type,
    onSuccess: acceptedFriendsReceived.type,
    onError: addFriendRequested.type,
  });
};

export const loadFriendRequestNotifications = () => {
  return apiCallBegan({
    url: `${url}/friend-request-notification`,
    method: "GET",
    onStart: friendsRequested.type,
    onSuccess: friendRequestNotificationsReceived.type,
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

export const confirmFriendRequest = (id: string, status: string) => {
  return apiCallBegan({
    url: `${url}/${id}`,
    method: "PATCH",
    data: { status },
    onStart: friendsRequested.type,
    onSuccess: friendRequestResponse.type,
    onError: friendsRequestFailed.type,
  });
};

export const isFriends = createSelector(
  (state: any) => state.entities.friends.list,
  (friends: IFriendRequest[]) =>
    memoize((data: IIsFriends) =>
      friends.find(
        (friend) =>
          (friend.requester === data.requester &&
            friend.recipient === data.recipient) ||
          (friend.requester === data.recipient &&
            friend.recipient === data.requester)
      )
    )
);

export const isAddFriendRequested = createSelector(
  (state: any) => state.entities.friends.notifications,
  (friends: IFriendRequest[]) =>
    memoize((data: IIsFriends) =>
      friends.find(
        (friend) =>
          (friend.requester === data.requester &&
            friend.recipient === data.recipient &&
            friend.status === "requested") ||
          (friend.requester === data.recipient &&
            friend.recipient === data.requester &&
            friend.status === "requested")
      )
    )
);
export const isCancelled = createSelector(
  (state: any) => state.entities.friends.list,
  (friends: IFriendRequest[]) =>
    memoize((id: string) => friends.find((friend) => friend._id === id))
);

export const getFriends = createSelector(
  (state: any) => state.entities.friends.notifications,
  (friends: IFriendRequest[]) =>
    memoize((id: string) =>
      friends.filter((request) => request.recipient === id)
    )
);

export const isAccepted = createSelector(
  (state: any) => state.entities.friends.list,
  (friends: IFriendRequest[]) =>
    memoize((id: string) => friends.find((request) => request._id === id))
);

export const getAcceptedFriends = createSelector(
  (state: any) => state.entities.friends.acceptedFriends,
  (friends: IAcceptedFriend[]) => friends
);

export const isLoading = createSelector(
  (state: any) => state.entities.friends,
  (friends: FriendSliceState) => friends.loading
);
