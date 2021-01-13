interface ICreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface IComment {
  _id: string;
  post: string;
  comment: string;
  createdBy: ICreatedBy;
  createdAt: string;
}
