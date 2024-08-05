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
  sendedRequest: mongoose.Schema.Types.ObjectId[];
  friendRequest: mongoose.Schema.Types.ObjectId[];
  friends: mongoose.Schema.Types.ObjectId[];
  isOnLine: Boolean;
  socketId: string;
  createdAt:Date;
  updatedAt:Date; 
}

export interface NotificationIN {
  _id: any;
  userId: mongoose.Schema.Types.ObjectId | UserIN;
  senderId: mongoose.Schema.Types.ObjectId | UserIN;
  type: string;
  view: Boolean;
  createdAt:Date;
  updatedAt:Date;
}


export interface MessageIN{
  _id:any;
  senderId:mongoose.Schema.Types.ObjectId|UserIN;
  receiver:mongoose.Schema.Types.ObjectId|UserIN;
  message:string;
  createdAt:Date;
  updatedAt:Date;
}