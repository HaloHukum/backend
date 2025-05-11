import Category, { ICategory } from "../models/category.model";

export class CategoryService {
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(categoryData);
    return await category.save();
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find().sort({ createdAt: -1 });
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async updateCategory(
    id: string,
    categoryData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id);
  }
}
