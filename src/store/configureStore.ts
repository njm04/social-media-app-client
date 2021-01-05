import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";

const storeConfig = () =>
  configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api],
    devTools: process.env.NODE_ENV !== "production",
  });

export default storeConfig;
