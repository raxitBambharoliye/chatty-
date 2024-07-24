import { google, drive_v3 } from "googleapis";
import * as fs from "fs";
import { DRIVE_FOLDER } from "../constant";

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function auth() {
  const jwtClient = new google.auth.JWT(
    process.env.DRIVE_CLIENT_EMAIL,
    undefined,
    process.env.DRIVE_CLIENT_PRIVATE_KEY,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}
const selectFolder = (type: string): string => {
  let folder: any = "";
  switch (type) {
    case DRIVE_FOLDER.PROFILE:
      folder = process.env.DRIVER_FOLDER_PROFILE;
      break;
    default:
      folder = "1z6hI4nTQdN04cdGli8FLPPvWQrWEvTQF";
      break;
  }
  return folder;
};
async function uploadFile(
  fileName: string,
  path: string,
  type: string
): Promise<string | void> {
  try {
    const authClient = await auth();

    const drive = google.drive({ version: "v3", auth: authClient });
    const folderId = selectFolder(type);
    const fileMetaData = {
      name: fileName,
      parents: [folderId],
    };

    const file: any = await drive.files.create({
      requestBody: fileMetaData,
      media: {
        body: fs.createReadStream(path),
        // mimeType: "text/plain"
      },
      fields: "id",
    });
    
    return file.data.id;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const authClient = await auth();
    const drive = google.drive({ version: "v3", auth: authClient });
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error(error);
  }
}

export { uploadFile };
