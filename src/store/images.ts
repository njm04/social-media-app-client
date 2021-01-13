import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { memoize } from "lodash";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import { IImage, IImageData } from "../interfaces/images";

const url = "/images";

// export interface IImageData {
//   _id?: string;
//   name?: string;
//   url?: string;
// }

// export interface IImage {
//   _id?: string;
//   postId?: string;
//   userId: string;
//   imageData: IImageData[];
// }

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
    imageReceived: (images, action: PayloadAction<IImage>) => {
      images.list.push(action.payload);
      images.loading = false;
    },
    coverPhotoUpdated: (images, action: PayloadAction<IImage>) => {
      const { _id } = action.payload;
      const index = images.list.findIndex((image: IImage) => image._id === _id);
      images.list[index] = action.payload;
      images.loading = false;
      toast.dark("Cover photo updated!");
    },
  },
});

const {
  imagesRequested,
  imagesFailed,
  imagesReceived,
  imageReceived,
  coverPhotoUpdated,
} = slice.actions;
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

export const addImages = (data: object) => {
  return apiCallBegan({
    url,
    method: "POST",
    data,
    onStart: imagesRequested.type,
    onSuccess: imageReceived.type,
    onError: imagesFailed.type,
  });
};

// prepared for future use.
export const updateCoverPhoto = (userId: string, imageData: IImageData) => {
  return apiCallBegan({
    url: `${url}/${userId}`,
    method: "PATCH",
    data: imageData,
    onStart: imagesRequested.type,
    onSuccess: coverPhotoUpdated.type,
    onError: imagesFailed.type,
  });
};

export const getImages = createSelector(
  (state: any) => state.entities.images.list,
  (images: IImage[]) => images
);

export const getUserCoverPhoto = createSelector(
  (state: any) => state.entities.images.list,
  (images: IImage[]) =>
    memoize((userId: string) => images.find((image) => image.userId === userId))
);

export const isImageExists = createSelector(
  (state: any) => state.entities.images.list,
  (images: IImage[]) =>
    memoize((id: string) => images.find((image) => image._id === id))
);
