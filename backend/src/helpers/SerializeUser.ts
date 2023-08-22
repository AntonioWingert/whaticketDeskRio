import Queue from "../models/Queue";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";

interface SerializedUser {
  id: number;
  name: string;
  email: string;
  profile: string;
  queues: Queue[];
  whatsapp: Whatsapp;
  userStatus: number;
  offlineMessage: string;
  awayMessage: string;
  profileImage: string;
}

export const SerializeUser = (user: User): SerializedUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    queues: user.queues,
    whatsapp: user.whatsapp,
    userStatus: user.userStatus,
    offlineMessage: user.offlineMessage,
    awayMessage: user.awayMessage,
    profileImage: user.profileImage
  };
};
