// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/database.js";
import auth from "./routes/auth.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

connectDB(); // connect to database

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", auth);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
