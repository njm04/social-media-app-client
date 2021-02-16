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
