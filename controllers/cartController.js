import cartModel from "../models/cartModel.js";
import mongoose from "mongoose";
import productModel from "../models/productModel.js";

export const addToCartController = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId } = req.body;
    const { reqItems } = req.body;
    console.log("items: " + reqItems);

    console.log("product: " + productId);

    if (!userId) {
      return res.send({ status: false, message: "Login to continue" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.send({ status: false, message: "Product not found" });
    }

    let cart = await cartModel.findOne({ userId }); // Find cart by userId
    if (!cart) {
      cart = new cartModel({ userId, items: [] }); // Create new cart if it doesn't exist
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (existingItemIndex !== -1) {
      return res.send({ status: true, message: "Product already exists" });
    } else {
      cart.items.push({ product: product._id, quantity: reqItems }); // Add productId to cart items
    }

    await cart.save(); // Save the cart to the database

    res.status(200).send({ status: true, message: "Product added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error adding to cart" });
  }
};

export const isInCartController = async (req, res) => {
  const { userId, productId } = req.query;

  if (!userId) {
    return res.send({ status: false, message: "Login to continue" });
  }

  let cart = await cartModel.findOne({ userId });

  // Check if cart exists for the given userId
  if (!cart) {
    return res.send({ status: false, message: "Cart not found" });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  console.log("line 72");
  if (existingItemIndex !== -1) {
    return res.send({ status: true, message: "Product already exists" });
  } else {
    return res.send({ status: false, message: "Product not in cart" });
  }
};

export const cartItemsController = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.send({ status: false, message: "Login to continue" });
    }

    let cart = await cartModel.findOne({ userId });

    // Check if cart exists for the given userId
    if (!cart) {
      return res.send({ status: false, message: "Cart not found" });
    }

    let products = [];

    for (const item of cart.items) {
      const product = await productModel.findById(item.product);
      const itemsRequired = item.quantity;
      if (product) {
        products.push({ ...product._doc, itemsRequired });
      }
    }

    if (products.length > 0) {
      // console.log(products);
      return res.status(200).send({
        status: true,
        products,
        message: "Cart items sucessfully fetched",
      });
    } else {
      return res.send({ status: false, message: "No items in the cart" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: false, message: "Error while loading cart items" });
  }
};

export const deleteCartItemController = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId) {
      return res.send({ status: false, message: "Login required" });
    }

    const cart = await cartModel.findOne({ userId: userId });

    if (!cart) {
      return res.send({ status: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).send({ status: false, message: "item not found" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.status(200).send({ status: true, message: "Item removed form cart" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: false, message: "Error while removing item from cart" });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("user: " + userId);

    if (!userId) {
      return res.send({ status: false, message: "User not logged in" });
    }

    const cart = await cartModel.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).send({ status: false, message: "Cart not found" });
    }

    cart.deleteOne();
    console.log(cart._id);
    await cartModel.findByIdAndDelete(cart._id);

    res
      .status(200)
      .send({ status: true, message: "Cart items removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error while deleting" });
  }
};
