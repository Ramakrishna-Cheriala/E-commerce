import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  addToCartController,
  isInCartController,
  cartItemsController,
  deleteCartItemController,
  deleteCartController,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add-to-cart", requireSignIn, addToCartController);

router.get("/is-in-cart", requireSignIn, isInCartController);

router.get("/cart-items", requireSignIn, cartItemsController);

router.delete("/delete-cart-item", requireSignIn, deleteCartItemController);

router.delete("/delete-cart", requireSignIn, deleteCartController);

export default router;
