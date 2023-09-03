import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import ShowUserService from "./ShowUserService";

interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  queueIds?: number[];
  whatsappId?: number;
  userStatus?: number;
  awayMessage?: string;
  offlineMessage?: string;
}

interface Request {
  userData: UserData;
  userId: string | number;
  profileImage?: string | null;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
}

const UpdateUserService = async ({
  userData,
  userId,
  profileImage
}: Request): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
    userStatus: Yup.number()
  });

  const {
    email,
    password,
    profile,
    name,
    queueIds = [],
    whatsappId,
    userStatus,
    awayMessage,
    offlineMessage
  } = userData;

  try {
    await schema.validate({ email, password, profile, name, userStatus });
  } catch (err) {
    throw new AppError(err.message);
  }

  await user.update({
    email,
    password,
    profile,
    name,
    whatsappId: whatsappId || null,
    profileImage: profileImage || null,
    userStatus,
    awayMessage,
    offlineMessage
  });

  await user.$set("queues", queueIds);

  await user.reload();

  return SerializeUser(user);
};

export default UpdateUserService;
