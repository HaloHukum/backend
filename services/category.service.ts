import { ICategory } from "../interfaces/category.interface";
import Category from "../models/category.model";

export default class CategoryService {
  static async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(categoryData);
    return await category.save();
  }

  static async getAllCategories(): Promise<ICategory[]> {
    return await Category.find().sort({ createdAt: -1 });
  }

  static async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  static async updateCategory(
    id: string,
    categoryData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
  }

  static async deleteCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id);
  }
}
