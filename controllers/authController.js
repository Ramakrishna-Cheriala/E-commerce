import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import mongoose from "mongoose";

export const registerController = async (req, res) => {
  try {
    const { name, email, number, address, password } = req.body;

    // checking empty fields
    if (!name || !email || !password || !number || !address) {
      return res.send({ error: "All fields are required" });
    }

    //checking existing user
    const existingUser = await userModel.findOne({
      $or: [{ name: name }, { email: email }, { number: number }],
    });
    if (existingUser) {
      return res.status(200).send({
        status: true,
        message: "User already exists",
      });
    }

    // user registration
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      number,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      status: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Registration failed",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { input, password } = req.body;

    if (!input || !password) {
      return res.status(404).send({
        status: false,
        message: "Invalid username or password",
      });
    }
    // check user
    const user = await userModel.findOne({
      $or: [{ name: input }, { email: input }, { number: input }],
    });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User does not exist",
      });
    }
    const passMatch = await comparePassword(password, user.password);
    if (!passMatch)
      return res.status(200).send({
        status: false,
        message: "Password mismatch",
      });

    //token generation
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "5d",
    });
    res.status(200).send({
      status: true,
      message: "login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.number,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Login failed",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User does not exist",
      });
    }

    // Generate a token for password reset link
    const token = JWT.sign({ email }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      text: `Reset your password by clicking the following link: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ status: false, message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.send({ status: true, message: "Email sent" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;
  console.log(password + ", " + token);
  if (!password) {
    return res.send({ message: "Password is required" });
  }
  if (!token) {
    return res.send({ message: "Token is required" });
  }

  try {
    const decoded = JWT.verify(token, process.env.RESET_PASSWORD_SECRET);

    if (decoded.exp < Date.now() / 1000) {
      return res
        .status(404)
        .send({ status: false, message: "Token is required" });
    }

    // Find the user by email
    // console.log("line 183");
    const user = await userModel.findOne({ email: decoded.email });
    console.log(user);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user's password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();

    // Return success response
    return res
      .status(200)
      .json({ status: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateUserController = async (req, res) => {
  const { id, name, email, number, address } = req.body;
  try {
    if (!name || !email || !number || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure `id` is a valid MongoDB ObjectID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.number = number;
    user.address = address;

    await user.save();

    res.status(200).send({
      status: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.number,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const promoteUserController = async (req, res) => {
  const { password, adminId } = req.body;
  const { id } = req.params;

  if (!adminId) {
    return res.status(404).send({ message: "Please login to continue." });
  }

  if (!password) {
    return res.send({ message: "Please enter password to continue." });
  }
  const user = await userModel.findById(id);
  const admin = await userModel.findById(adminId);

  if (!user || !admin) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log(user.password);
  console.log(password);

  const passMatch = await comparePassword(password, admin.password);

  if (!passMatch) {
    return res.status(200).send({
      status: false,
      message: "Password mismatch",
    });
  }

  user.role = 1;

  await user.save();

  res
    .status(201)
    .send({ status: true, message: `${user.name} promoted successfully` });
};
