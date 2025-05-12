import { Request, Response } from "express";

import CategoryService from "../services/category.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         title:
 *           type: string
 *           description: The category title
 *         description:
 *           type: string
 *           description: The category description
 *         subCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: List of sub-categories
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was last updated
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Category created successfully
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Category not found
 */

export default class CategoryController {
  /**
   * @swagger
   * /categories:
   *   post:
   *     summary: Create a new category
   *     tags: [Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *             properties:
   *               title:
   *                 type: string
   *                 example: Criminal Law
   *               description:
   *                 type: string
   *                 example: Legal matters related to criminal offenses
   *               subCategories:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Theft", "Assault", "Fraud"]
   *     responses:
   *       201:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json({
        status: "success",
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /categories:
   *   get:
   *     summary: Get all categories
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: List of categories
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Categories retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Category'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        status: "success",
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /categories/{id}:
   *   get:
   *     summary: Get a category by ID
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID
   *     responses:
   *       200:
   *         description: Category found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async getCategoryById(req: Request, res: Response) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /categories/{id}:
   *   put:
   *     summary: Update a category
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: Updated Criminal Law
   *               description:
   *                 type: string
   *                 example: Updated description for criminal law
   *               subCategories:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Updated Theft", "Updated Assault"]
   *     responses:
   *       200:
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async updateCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Category updated successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /categories/{id}:
   *   delete:
   *     summary: Delete a category
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID
   *     responses:
   *       200:
   *         description: Category deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async deleteCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.deleteCategory(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
