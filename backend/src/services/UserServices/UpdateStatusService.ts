import * as Yup from "yup";

import AppError from "../../errors/AppError";
import StatusQueue from "../../models/StatusQueue";

interface Request {
  userId: number;
  alteredUserId: number;
  lastStatusId: number;
  actualStatusId: number;
}

const UpdateStatusService = async ({
  userId,
  alteredUserId,
  lastStatusId,
  actualStatusId
}: Request): Promise<void> => {
  const schema = Yup.object().shape({
    userId: Yup.number().required(),
    alteredUserId: Yup.number().required(),
    lastStatusId: Yup.number().required(),
    actualStatusId: Yup.number().required()
  });

  try {
    await schema.validate({
      userId,
      alteredUserId,
      lastStatusId,
      actualStatusId
    });
  } catch (err) {
    throw new AppError(err.message);
  }

  await StatusQueue.create({
    userId,
    alteredUserId,
    lastStatusId,
    actualStatusId,
    date: Date.now()
  });
};

export default UpdateStatusService;
