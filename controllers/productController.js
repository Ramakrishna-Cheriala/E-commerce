import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_KEY,
  publicKey: process.env.PAYMENTS_PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, categoryName, quantity, image } =
      req.body;

    if (
      !name ||
      !description ||
      !price ||
      !categoryName ||
      !quantity ||
      !image
    ) {
      return res.send({ message: "All fields are required" });
    }

    // Search for the category in the database based on the provided category name
    let existingCategory = await categoryModel.findOne({ name: categoryName });

    // If the category does not exist, create a new category
    if (!existingCategory) {
      existingCategory = await categoryModel.create({
        name: categoryName,
        slug: slugify(categoryName),
      });
    }

    // Extract category ID
    const categoryId = existingCategory._id;

    const existingProduct = await productModel.findOne({ name });

    if (existingProduct) {
      return res.send({ status: true, message: "Product already exists" });
    }

    const product = await productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category: categoryId, // Store category ID along with the product
      quantity,
      image,
    }).save();

    res.status(201).send({
      status: true,
      product: product,
      message: "Product saved successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: false, error, message: "Error creating product" });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const page = req.query.page || 1; //
    const limit = 6;
    const skip = (page - 1) * limit;

    // Fetch products for the specified page and limit
    const products = await productModel.find({}).skip(skip).limit(limit);

    // Count total number of products
    const totalCount = await productModel.countDocuments();

    res.status(200).send({
      status: true,
      products: products,
      total: totalCount,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error getting products" });
  }
};

export const getProductDetailsController = async (req, res) => {
  const { id } = req.params;

  // console.log("line 82: " + id);

  try {
    const productDetails = await productModel.findById(id);

    // console.log(productDetails);

    if (!productDetails) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    const category = await categoryModel.findById(productDetails.category);

    if (!category) {
      return res
        .status(404)
        .send({ status: false, message: "Category not found" });
    }

    res.status(200).send({
      status: true,
      productDetails,
      categoryName: category.name,
      message: "Product details successfully fetched",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: false, message: "Error getting product details" });
  }
};

export const updateProductController = async (req, res) => {
  const { description, price, quantity } = req.body;
  const { id } = req.params;

  try {
    const productDetails = await productModel.findById(id);

    if (!description || !price || !quantity) {
      return res.send({ message: "All fields required" });
    }

    if (!productDetails) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    productDetails.description = description;
    productDetails.price = price;
    productDetails.quantity = quantity;

    const updatedProductDetails = await productDetails.save();

    res.status(200).send({
      status: true,
      updatedProductDetails,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: false, message: "error updating product details" });
  }
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }
    await product.deleteOne();

    res
      .status(201)
      .send({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error deleting product" });
  }
};

export const fetchAllUsersController = async (req, res) => {
  try {
    const userDetails = await userModel.find({});
    res.status(200).send({ status: true, userDetails, message: "All users" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: false, message: "Error fetching user details" });
  }
};

export const getCategoryProductsController = async (req, res) => {
  try {
    const { category } = req.params;
    console.log("Category:", category);

    const catDetails = await categoryModel.findOne({ slug: category });

    if (!catDetails) {
      return res.send({ status: false, message: "Category not found" });
    }

    const products = await productModel.find({ category: catDetails._id });

    if (!products) {
      return res.send({ status: false, message: "Product not found" });
    }

    res.status(200).send({
      status: true,
      products,
      message: "Product successfully fetched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error fetching products" });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ status: true, total, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, message: "error fetching products" });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    let page = req.params.page ? parseInt(req.params.page) : 1;
    console.log("page :" + page);

    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage);

    // console.log("products :" + products);

    for (let i = 0; i < products.length; i++) {
      console.log("product: " + products[i].name);
    }

    res.status(200).send({ status: true, products, message: "Product list" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, message: "Error fetching products" });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    // console.log(results);
    res.status(200).send({ status: true, result: results });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error fetching products" });
  }
};

export const paymentTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, responce) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(responce);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const paymentController = async (req, res) => {
  try {
    const { cart, nonce, total, userId, address, requiredQuantity } = req.body;
    // console.log("304: " + requiredQuantity);

    let orderProducts = [];

    // Iterate over each item in the cart and extract productId and quantity
    for (const item of cart) {
      // console.log("309: " + item.itemsRequired);
      const products = await productModel.findById(item._id);
      orderProducts.push({
        productId: item._id,
        productName: products.name,
        quantity: item.itemsRequired,
      });

      // Subtract quantity required from the product model
      const product = await productModel.findById(item._id);
      // console.log(product.quantity);

      if (product) {
        product.quantity = String(
          parseInt(product.quantity) - item.itemsRequired
        );
        await product.save(); // Save the updated product
      }
    }

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (err, result) {
        if (result) {
          const newOrder = new orderModel({
            products: orderProducts,
            payment: result,
            buyers: userId,
            deliveryAt: address,
          });
          await newOrder.save(); // Save the new order
          res.send({ status: true });
        } else {
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred while processing payment");
  }
};

export const userOrdersController = async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log(userId);
    if (!userId) {
      return res.send({ message: "login required" });
    }
    const orderDetails = await orderModel.find({ buyers: userId });

    console.log(orderDetails);

    res.status(200).send({
      status: true,
      orderDetails,
      message: "success",
      additionalMessage: "details",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "Error occurred while" });
  }
};
