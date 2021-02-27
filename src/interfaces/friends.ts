import { IProfPic } from "./profPic";

export interface IFriendRequest {
  _id: string;
  requester: string;
  recipient: string;
  status: string;
}

export interface IIsFriends {
  requester: string;
  recipient: string;
}

export interface IAcceptedFriend {
  _id: string;
  fullName: string;
  profilePicture: IProfPic;
  status: string;
}
