import { combineReducers } from "redux";
import authReducer from "./auth";
import postsReducer from "./posts";
import commentsReducer from "./comments";
import commentsCountReducer from "./commentCount";

export default combineReducers({
  auth: authReducer,
  posts: postsReducer,
  comments: commentsReducer,
  commentsCount: commentsCountReducer,
});
