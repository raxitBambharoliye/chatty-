import mongoose from "mongoose";

// user interface
export interface UserIN {
  _id: any;
  id: any;
  userName: string;
  DOB: string;
  email: string;
  tagLine: string;
  profilePicture: string;
  isBlocked: Boolean;
  blockedUserId: string[];
  blockedByUsers: string[];
  withEmail: Boolean;
  verifiedEmail: Boolean;
  password: string;
  profilePictureId: string;
  sendedRequest: mongoose.Schema.Types.ObjectId[];
  friendRequest: mongoose.Schema.Types.ObjectId[];
  friends: mongoose.Schema.Types.ObjectId[];
  isOnLine: Boolean;
  socketId: string;
  createdAt: Date;
  updatedAt: Date;
  groups: mongoose.Schema.Types.ObjectId[] | GroupIN[];
  pinedUsers:  mongoose.Schema.Types.ObjectId[] | string[];
  mutedUser:  mongoose.Schema.Types.ObjectId[] | string[];
  messageOrder: mongoose.Schema.Types.ObjectId[] | string[];
  unFollowedUser: mongoose.Schema.Types.ObjectId[] | string[];
  unFollowedByUsers: mongoose.Schema.Types.ObjectId[] | string[];
}

export interface NotificationIN {
  _id: any;
  userId: mongoose.Schema.Types.ObjectId | UserIN;
  senderId: mongoose.Schema.Types.ObjectId | UserIN;
  type: string;
  view: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageIN {
  _id: any;
  id: mongoose.Schema.Types.ObjectId | string;
  senderId: mongoose.Schema.Types.ObjectId | UserIN;
  receiver: mongoose.Schema.Types.ObjectId | UserIN;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupIN {
  id: mongoose.Schema.Types.ObjectId | string | any;
  _id: mongoose.Schema.Types.ObjectId | string;
  groupName: string;
  tagLine: string;
  groupMembers: string[] | UserIN[];
  creator: string | UserIN;
  admin: string[] | UserIN[];
  groupProfile: string;
  type: string;
}
