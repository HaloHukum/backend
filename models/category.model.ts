import mongoose, { Schema } from "mongoose";

import { ICategory } from "../interfaces/category.interface";

const categorySchema: Schema<ICategory> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subCategories: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);
export { ICategory }; // TODO
export default Category;
