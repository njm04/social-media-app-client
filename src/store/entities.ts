import { combineReducers } from "redux";
import authReducer from "./auth";
import postsReducer from "./posts";
import commentsReducer from "./comments";
import commentsCountReducer from "./commentCount";
import imagesReducer from "./images";
import likesReducer from "./likes";
import usersReducer from "./users";

export default combineReducers({
  auth: authReducer,
  posts: postsReducer,
  comments: commentsReducer,
  commentsCount: commentsCountReducer,
  images: imagesReducer,
  likes: likesReducer,
  users: usersReducer,
});
