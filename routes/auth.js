import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  updateUserController,
  promoteUserController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router(); // router object

//Register (POST)
router.post("/register", registerController);

//login (POST)
router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password/:token", resetPasswordController);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/update-user/:id", requireSignIn, updateUserController);

router.put("/promote-user/:id", requireSignIn, isAdmin, promoteUserController);

export default router;
