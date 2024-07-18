// user interface
export interface UserIN {
  _id: any,
  id:string,
  userName: string;
  DOB: string;
  email: string;
  tagLine: string;
  profilePicture: string;
  isBlocked: Boolean;
  blockedUserId: string[];
  withEmail: Boolean;
  verifiedEmail: Boolean;
  password:string
}
