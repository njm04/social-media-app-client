import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";

const storeConfig = () =>
  configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api],
  });

export default storeConfig;
