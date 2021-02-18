import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { isEmpty } from "lodash";
import { apiCallBegan } from "./api";

const url = "/auth";
const tokenKey = "token";

interface AuthSliceState {
  user: object | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthSliceState = {
  user: {},
  isAuthenticated: false,
  loading: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequested: (auth, action) => {
      auth.loading = true;
    },
    authFailed: (auth, action) => {
      auth.loading = false;
    },
    authTokenReceived: (auth, action: PayloadAction<string>) => {
      localStorage.setItem(tokenKey, action.payload);
      auth.loading = false;
    },
    authReceived: (auth, action: PayloadAction<object | null>) => {
      auth.user = action.payload;
      auth.isAuthenticated = !isEmpty(action.payload);
      auth.loading = false;
    },
    userLoggedOut: (auth, action: PayloadAction<object>) => {
      auth.user = action.payload;
      auth.isAuthenticated = !isEmpty(action.payload);
    },
  },
});

const { authRequested, authFailed, authTokenReceived } = slice.actions;
export const { authReceived, userLoggedOut } = slice.actions;
export default slice.reducer;

export const login = (user: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data: user,
    onStart: authRequested.type,
    onSuccess: authTokenReceived.type,
    onError: authFailed.type,
  });
};

export const logout = (userId: string) => {
  return apiCallBegan({
    url: `${url}/logout/${userId}`,
    method: "PATCH",
    data: userId,
    onStart: authRequested.type,
    onSuccess: userLoggedOut.type,
    onError: authFailed.type,
  });
};

// TODO: replace type any with the correct types
export const getUser = createSelector(
  (state: any) => state.entities.auth,
  // check isAuthenticated or not, this function work either way
  (auth: AuthSliceState) => (auth.isAuthenticated ? auth.user : null)
);

export const isLoading = createSelector(
  (state: any) => state.entities.auth,
  (auth: AuthSliceState) => auth.loading
);
