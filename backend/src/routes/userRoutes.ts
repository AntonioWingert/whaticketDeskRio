import { Router } from "express";
import multer from "multer";

import isAuth from "../middleware/isAuth";
import * as UserController from "../controllers/UserController";
import uploadConfig from "../middleware/uploadImages";

const userRoutes = Router();

const upload = multer(uploadConfig);

userRoutes.get("/users", isAuth, UserController.index);

userRoutes.post(
  "/users",
  isAuth,
  upload.single("profileImage"),
  UserController.store
);

userRoutes.put(
  "/users/:userId",
  isAuth,
  upload.single("profileImage"),
  UserController.update
);

userRoutes.post("/users/:userId/status", isAuth, UserController.updateStatus);

userRoutes.get("/users/:userId", isAuth, UserController.show);

userRoutes.delete("/users/:userId", isAuth, UserController.remove);

export default userRoutes;
