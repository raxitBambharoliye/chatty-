import mongoose from "mongoose";

// user interface
export interface UserIN {
  _id: any;
  id: string;
  userName: string;
  DOB: string;
  email: string;
  tagLine: string;
  profilePicture: string;
  isBlocked: Boolean;
  blockedUserId: string[];
  withEmail: Boolean;
  verifiedEmail: Boolean;
  password: string;
  profilePictureId: string;
  sendedRequest:mongoose.Schema.Types.ObjectId;
  friendRequest: mongoose.Schema.Types.ObjectId;
  isOnLine: Boolean;
  socketId: string;
}


export interface NotificationIN{
  _id: any;
  userId: mongoose.Schema.Types.ObjectId | UserIN;
  type: string;
  view:Boolean
}