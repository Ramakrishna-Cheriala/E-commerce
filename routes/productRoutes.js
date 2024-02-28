import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createProductController,
  getAllProductsController,
  getProductDetailsController,
  updateProductController,
  deleteProductController,
  fetchAllUsersController,
  getCategoryProductsController,
  productCountController,
  productListController,
  searchProductController,
  paymentTokenController,
  paymentController,
  userOrdersController,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, createProductController);

router.get("/get-all-products", getAllProductsController);

router.get("/product-details/:id", getProductDetailsController);

router.get(
  "/get-products-by-category/:category",
  getCategoryProductsController
);

router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  updateProductController
);

router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

router.get("/all-users", requireSignIn, isAdmin, fetchAllUsersController);

router.get("/product-count", productCountController);

router.get("/product-list/:page", productListController);

router.get("/search/:keyword", searchProductController);

router.get("/payments/token", paymentTokenController);

router.post("/payment-cart-items", requireSignIn, paymentController);

router.get("/user-orders", requireSignIn, userOrdersController);

export default router;
