import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { memoize } from "lodash";
import { toast } from "react-toastify";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const url = "/users";

export interface IProfPic {
  name?: string;
  url?: string;
}

export interface IUser {
  addressTwo: string;
  status: string;
  friends: string[];
  isDeleted: false;
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
  contactNumber: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
  profilePicture: IProfPic;
}

interface UsersSliceState {
  list: IUser[];
  loading: boolean;
}

const initialState: UsersSliceState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
    },
    usersFailed: (users, action) => {
      users.loading = false;
    },
    usersReceived: (users, action: PayloadAction<IUser[]>) => {
      users.list = action.payload;
      users.loading = false;
    },
    userProfPicUpdated: (users, action: PayloadAction<IUser>) => {
      const { _id } = action.payload;
      const index = users.list.findIndex((user: IUser) => user._id === _id);
      users.list[index] = action.payload;
      users.loading = false;
      toast.dark("You've updated your profile picture.");
    },
  },
});

const {
  usersRequested,
  usersFailed,
  usersReceived,
  userProfPicUpdated,
} = slice.actions;
export default slice.reducer;

export const loadUsers = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: usersRequested.type,
    onSuccess: usersReceived.type,
    onError: usersFailed.type,
  });
};

export const updateUserProfPic = (userId: string, data: IProfPic) => {
  return apiCallBegan({
    url: `${url}/update-profile-picture/${userId}`,
    method: "PATCH",
    data: data,
    onStart: usersRequested.type,
    onSuccess: userProfPicUpdated.type,
    onError: usersFailed.type,
  });
};

export const getProfilePicture = createSelector(
  (state: any) => state.entities.users.list,
  (users: IUser[]) =>
    memoize(
      (userId: string) =>
        users.find((user: IUser) => user._id === userId)?.profilePicture
    )
);
