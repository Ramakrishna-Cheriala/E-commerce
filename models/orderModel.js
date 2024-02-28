import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: "Product",
        },
        productName: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    payment: {},
    buyers: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    deliveryAt: {
      type: String,
    },
    status: {
      type: String,
      default: "Not Procesed",
      enum: ["Not Procesed", "Shipping", "Shipped", "Delivered", "Cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
