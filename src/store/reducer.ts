import { combineReducers } from "redux";
import { PayloadAction } from "@reduxjs/toolkit";
import entitiesReducer from "./entities";
import { userLoggedOut } from "./auth";

const appReducer = combineReducers({
  entities: entitiesReducer,
});

const reducer = (state: any, action: PayloadAction) => {
  if (action.type === userLoggedOut.type) state = undefined;

  return appReducer(state, action);
};

export default reducer;
