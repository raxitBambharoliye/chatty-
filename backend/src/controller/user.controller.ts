import { compare, hash } from "bcrypt";
import { EVENT_NAME, MQ } from "../common";
import { CONFIG, DRIVE_FOLDER, MODEL, UPLOAD_FOLDER } from "../constant";
import logger from "../utility/logger";
import jwt from "jsonwebtoken";
import { createToken, decryptData, encryptData, setCookieData } from "../utility/common";
import { GroupIN, MessageIN, UserIN } from "../utility/interfaces";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { sendMail } from "../services/sendmail.service";
import { deleteFile, uploadFile } from "../services/googleDrive.service";
import { Request } from "express";
import { removeFile } from "../utility/logic/file";
import { sendToRoom, sendToSocket } from "../eventHandlers";
export const registerUser = async (req: any, res: any) => {
  try {
    req.body.password = await hash(req.body.password, 10);
    const user = await MQ.insertOne<UserIN>(MODEL.USER_MODEL, req.body);
    if (user) {
      let token = createToken(user.id, user.email);
      if (token) {
        // delete user.password;
        return res.status(200).json({
          message: "user logged in successfully",
          userData: user,
          token,
        });
      }
    } else {
      res.status(500).json({
        message: "some thing went wrong, please try later",
      });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN registerUser  :: ${error}`);
    console.log("CATCH ERROR IN registerUser  :: ", error);
  }
};

export const userLogIn = async (req: any, res: any) => {
  try {
    let { email, password } = req.body;
    let user = await MQ.findOne<UserIN>(MODEL.USER_MODEL, { email: email });
    if (!user) {
      return res.status(400).json({
        message: "invalid email address or password",
      });
    }
    if (!(await compare(password, user.password))) {
      return res.status(400).json({
        message: "invalid email address or password",
      });
    }
    let secret = process.env.JWT_SECRET || "";
    let token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: 60 * 60 * 24,
    });

    if (token) {
      const notifications = await MQ.findWithPopulate(MODEL.NOTIFICATION_MODEL, { userId: user.id }, "senderId", "userName profilePicture");
      console.log("notifications", notifications);
      // delete user.password;
      return res.status(200).json({
        message: "user logged in successfully",
        userData: user,
        notifications,
        token,
      });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN logIn :: ${error}`);
    console.log("error", error);
  }
};

export const loginWithGoogleHandler = async (req: any, res: any) => {
  try {
    /* 
// This function is called after successful authentication
{
  sub: '113352132353108516881',
  name: 'raxit dev',
  given_name: 'raxit',
  family_name: 'dev',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocIGBlkYdHFoLb7PxRVcMwD9nHriOECEeZivVcQJA_8JMgj4PQ=s96-c',
  email: 'raxitdev55@gmail.com',
  email_verified: true
} */
    let userData = req.user._json;
    if (userData && userData.email_verified) {
      let user = await MQ.findOne<UserIN>(MODEL.USER_MODEL, { email: userData.email });
      if (!user) {
        const insertData = {
          userName: userData.name,
          email: userData.email,
          profilePicture: userData.picture,
          withEmail: true,
        };
        user = await MQ.insertOne(MODEL.USER_MODEL, insertData);
      }
      if (!user) {
        return res.status(500).json({
          message: "some thing went wrong, please try later",
        });
      }
      if (!user.verifiedEmail) {
        //NOTE - send verification email
      }
      let token = createToken(user.id, user.email);
      res.cookie("userData", JSON.stringify(setCookieData(user)));
      res.cookie("userToken", JSON.stringify(setCookieData(token)));
      res.redirect(`${process.env.CLIENT_URL}`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}`);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN :: loginWithGoogleHandler ::: ${error}`);
    console.log("error", error);
  }
};

export const sendVerificationMail = async (req: any, res: any) => {
  try {
    const { email, password, userName, DOB } = req.body;

    let html = "";
    let source = "";
    const filePath = path.join(__dirname, "../view/verifyEmail.html");
    const enCryptData = encryptData({ email, password, userName, DOB }, true);
    if (fs.existsSync(filePath)) {
      source = await fs.readFileSync(filePath, "utf8").toString();
      const template = await handlebars.compile(source);
      html = template({ url: `https://chatty-pie-host.loca.lt/user/verifyEmail?data=${enCryptData}` });
    }
    let mailResponsive: Boolean = await sendMail(html, "Email Verification");
    if (mailResponsive) {
      return res.status(200).json({ success: true, message: "verification email sent successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send verification email. please try after some time." });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN sendVerificationMail ::: ${error}`);
    console.log("error", error);
  }
};

export const verifyEmail = async (req: any, res: any) => {
  try {
    let encryptedData: string = req.query.data;
    if (!encryptedData) {
      return res.status(400).json({ success: false, message: "something went wrong" });
    }
    let decryptedData = decryptData(encryptedData);
    if (decryptedData && decryptedData.email && decryptedData.password && decryptedData.userName && decryptedData.DOB) {
      let { email, password, userName, DOB } = decryptedData;
      let checkUser = await MQ.find<UserIN[]>(MODEL.USER_MODEL, { $or: [{ email: email }, { userName: userName }] });
      if (checkUser && checkUser.length) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      password = await hash(password, 10);
      let insertData = {
        userName,
        email,
        DOB,
        password,
      };

      const user = await MQ.insertOne<UserIN>(MODEL.USER_MODEL, insertData);
      if (user) {
        res.sendFile(path.join(__dirname, "../view/emailVerified.html"));
      } else {
        res.status(500).json({
          message: "some thing went wrong, please try later",
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "something went wrong" });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN verifyEmail :::  ${error}`);
    console.log("error", error);
  }
};

export const editUserProfile = async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "user data not found " });
    }
    const userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      return res.status(400).json({ errors: [{ msg: "user data not found ", path: "root" }] });
    }
    if (req.file) {
      console.log("req.file", req.file);
      if (userData.profilePicture && userData.profilePictureId) {
        await deleteFile(userData.profilePictureId);
      }
      //NOTE - code for upload file in google drive
      // const fileId = await uploadFile(req.file.filename, req.file.path, DRIVE_FOLDER.PROFILE);
      // if (!fileId) {
      //   return res.status(500).json({errors:[{ msg: "Some thing want wrong, pleas try after some time.",path:"root" }]});
      // }
      // const profilePictureURL = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      //  req.body.profilePicture = profilePictureURL;
      //  req.body.profilePictureId = fileId;

      req.body.profilePicture = `http://localhost:${process.env.SERVER_PORT}${UPLOAD_FOLDER.USER_PROFILE}/${req.file.filename}`;
    }
    const updatedUser = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userId, req.body, true);
    res.status(200).json({ message: "user profile update successfully", user: updatedUser });
  } catch (error) {
    logger.error(`CATCH ERROR IN editUserProfile ::: ${error}`);
    console.log("error", error);
  }
};

export const searchUser = async (req: Request, res: any) => {
  try {
    const search = req.params.search;
    const users = await MQ.find<UserIN[]>(MODEL.USER_MODEL, { $or: [{ userName: { $regex: ".*" + search + ".*", $options: "i" } }] }, { userName: 1, tagLine: 1, profilePicture: 1 });
    return res.status(200).json({ success: true, searchResult: users });
  } catch (error) {
    logger.error(`CATCH ERROR : IN :: searchUser ${error}`);
    console.log("error", error);
  }
};

export const generateUser = async () => {
  try {
    return;
    var userNameArrayOld: string[] = ["patel", "kano", "radha", "radhe", "raxit", "test_check", "__lol", "mehul", "meet", "hari"];
    var userNameArray: string[] = [];
    for (var i = 1; i <= 10; i++) {
      const insertData = {
        userName: userNameArray[i],
        email: `${userNameArray[i]}@t.com`,
        password: "123456",
        tagLine: "testDelete",
      };
      insertData.password = await hash(insertData.password, 10);
      await MQ.insertOne(MODEL.USER_MODEL, insertData);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN generateUser ::: ${error}`);
    console.log("error", error);
  }
};

export const getMessages = async (req: any, res: any) => {
  try {
    const { senderId, receiverId, page } = req.body;
    if (!page || !senderId || !receiverId) {
      return res.status(400).json({ message: "something want wrong, please try agin." });
    }
    const messages = await MQ.findWithPagination<MessageIN[]>(
      MODEL.MESSAGE_MODEL,
      {
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      CONFIG.MESSAGE_LOAD_LIMIT,
      page,
      { createdAt: -1 }
    );
    if (!messages) {
      return res.status(400).json({ message: "something want wrong" });
    }
    res.send(messages.reverse());
  } catch (error) {
    logger.error(`CATCH ERROR IN getMessage ::: ${error}`);
    console.log("error", error);
  }
};

export const createGroup = async (req: any, res: any) => {
  try {
    const user = await MQ.findById<UserIN>(MODEL.USER_MODEL, req.body.creator);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    let groupMember = req.body.groupMember.split(",").map((id: string) => id);
    groupMember = groupMember.filter((value: string, index: number, array: string[]) => array.indexOf(value) === index);
    for (var i = 0; i < groupMember.length; i++) {
      const checkUser = await MQ.findById<UserIN>(MODEL.USER_MODEL, groupMember[i]);
      if (!checkUser) {
        if (req.file) {
          removeFile(path.join(__dirname, "../", UPLOAD_FOLDER.GROUP_PROFILE, req.file.filename));
        }
        return res.status(400).json({ message: "giver friends are not in record " });
      }
      if (!user.friends.includes(checkUser._id)) {
        if (req.file) {
          removeFile(path.join(__dirname, "../", UPLOAD_FOLDER.GROUP_PROFILE, req.file.filename));
        }
        return res.status(400).json({ message: "you cant add user that is not your friend" });
      }
    }
    let insertGroupData: any = {
      admin: [user.id],
      groupName: req.body.groupName,
      tagLine: req.body.tagLine,
      creator: req.body.creator,
      groupMembers: [...groupMember, req.body.creator],
      groupProfile: null,
    };
    if (req.file) {
      insertGroupData.groupProfile = `http://localhost:${process.env.SERVER_PORT}${UPLOAD_FOLDER.GROUP_PROFILE}/${req.file.filename}`;
    }
    const groupData = await MQ.insertOne<GroupIN>(MODEL.GROUP_MODEL, insertGroupData);
    if (groupData) {
      await MQ.findByIdAndUpdate(MODEL.USER_MODEL, user.id, { $push: { groups: groupData.id } });
      for (var i = 0; i < groupMember.length; i++) {
        if (user.id == groupMember[i]) {
          console.log("group success ");
          continue;
        }
        let updateMember = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, groupMember[i], { $push: { groups: groupData.id } }, true);
        console.log("updateMember", updateMember);
        if (!updateMember) {
          continue;
        }
        if (updateMember && updateMember?.socketId) {
          const sendEventData = {
            eventName: EVENT_NAME.ACCEPT_FOLLOW_REQUEST,
            data: { newFriend: groupData },
          };
          sendToSocket(updateMember.socketId, sendEventData);
        }
      }
      return res.status(200).json({ message: "Group created successfully", newGroup: groupData });
    }
    return res.status(400).json({ message: "something went wrong" });
  } catch (error) {
    logger.error(`CATCH ERROR IN createGroup ::: ${error}`);
    console.log("error", error);
    return res.status(400).json({ message: "something went wrong" });
  }
};

export const updateGroup = async (req: any, res: any) => {
  try {
    const { groupId, changer } = req.body;
    const groupData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, groupId);
    console.log("groupData", groupData);
    if (!groupData) {
      return res.status(400).json({ message: "group not found" });
    }
    if (!groupData.admin.includes(changer)) {
      return res.status(400).json({ message: "you are not admin of this group" });
    }

    const adminData = await MQ.findById<UserIN>(MODEL.USER_MODEL, changer);
    console.log("adminData", adminData);

    if (req.file) {
      removeFile(path.join(__dirname, "../", UPLOAD_FOLDER.GROUP_PROFILE, groupData.groupProfile));
      req.body.groupProfile = `http://localhost:${process.env.SERVER_PORT}${UPLOAD_FOLDER.GROUP_PROFILE}/${req.file.filename}`;
    } else {
      req.body.groupProfile = groupData.groupProfile;
    }
    console.log("req.body", req.body);
    let query = {
      $set: {
        groupProfile: req.body.groupProfile,
        groupName: req.body.groupName,
        tagLine: req.body.tagLine,
      },
    };
    const updateGroupData = await MQ.findByIdAndUpdate<GroupIN>(MODEL.GROUP_MODEL, groupData.id, query, true);
    console.log("updateGroupData", updateGroupData);

    if (!updateGroupData) {
      return res.status(400).json({ message: "something went wrong" });
    }

    const responseData = {
      eventName: EVENT_NAME.UPDATE_FRIEND,
      data: {
        id: updateGroupData.id,
        updateData: {
          groupProfile: updateGroupData.groupProfile,
          groupName: updateGroupData.groupName,
          tagLine: updateGroupData.tagLine,
        },
      },
    };
    sendToRoom(groupData._id.toString(), responseData);
    return res.status(200).json({message: "group data updated successfully", data:{closeModal:true}});
  } catch (error) {
    logger.error(`CATCH ERROR IN updateGroup ::: ${error}`);
    console.log("error", error);
    return res.status(400).json({ message: "something went wrong" });
  }
};
