export interface IImageData {
  _id?: string;
  name?: string;
  url?: string;
}

export interface IImage {
  _id?: string;
  postId?: string;
  userId: string;
  imageData: IImageData[];
}
