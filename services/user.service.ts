import User from "../models/user.model";

export default class UserService {
  // Create a new user
  static async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  }

  // Get all users
  static async getUsers() {
    return await User.find();
  }

  // Get a single user by ID
  static async getUser(id: string) {
    return await User.findById(id);
  }

  // Update a user
  static async updateUser(id: string, updateData: any) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // Delete a user
  static async deleteUser(id: string) {
    return await User.findByIdAndDelete(id);
  }
}
