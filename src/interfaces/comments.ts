interface ICreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface IEditComment {
  id: string;
  updatedComment: string;
}

export interface IComment {
  _id: string;
  post: string;
  comment: string;
  createdBy: ICreatedBy;
  createdAt: string;
}
