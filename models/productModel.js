import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    image: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Category",
      type: String,
      required: true,
    },
    shipping: {
      type: Boolean,
      default: 0,
    },
  },
  { timeStamps: true }
);

export default mongoose.model("Products", productSchema);
