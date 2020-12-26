import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const url = "/images";

export interface IImageData {
  _id?: string;
  name: string;
  url: string;
}

export interface IImage {
  _id: string;
  postId: string;
  imageData: IImageData[];
}

interface ImagesSliceState {
  list: IImage[];
  loading: boolean;
}

const initialState: ImagesSliceState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "images",
  initialState,
  reducers: {
    imagesRequested: (images, action) => {
      images.loading = true;
    },
    imagesFailed: (images, action) => {
      images.loading = false;
    },
    imagesReceived: (images, action: PayloadAction<IImage[]>) => {
      images.list = action.payload;
      images.loading = false;
    },
  },
});

const { imagesRequested, imagesFailed, imagesReceived } = slice.actions;
export default slice.reducer;

export const loadImages = () => {
  return apiCallBegan({
    url,
    method: "GET",
    onStart: imagesRequested.type,
    onSuccess: imagesReceived.type,
    onError: imagesFailed.type,
  });
};

export const getImages = createSelector(
  (state: any) => state.entities.images.list,
  (images: IImage[]) => images
);
