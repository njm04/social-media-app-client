interface IPostedBy {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface IEditPost {
  id: string;
  newPost: string;
}

export interface IPostImages {
  name: string;
  url: string;
}

export interface IPost {
  _id: string;
  post: string;
  postedBy: IPostedBy;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  likes: number;
  postImages: IPostImages[];
}
