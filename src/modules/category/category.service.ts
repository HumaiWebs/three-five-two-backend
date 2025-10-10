import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly category: Model<Category>,
  ) { }

  async createCategory(name: string, description?: string, parent?: string) {
    const level = parent
      ? ((await this.category.findById(parent))?.level ?? -1) + 1
      : 0;
    const newCategory = await this.category.create({
      name,
      description,
      parent: parent || null,
      level,
    });
    return { success: true, category: newCategory };
  }

  async getAllCategories(page?: number, limit?: number) {
    if (page === -1) {
      const allCategories = await this.category.find().populate({
        path: 'parent',
        model: 'Category',
      });
      return {
        success: true,
        items: allCategories,
        total: allCategories.length,
        page: 1,
        pages: 1,
      };
    }
    const categories = await this.category
      .find()
      .populate({
        path: 'parent',
        model: 'Category',
      })
      .skip(((page ?? 1) - 1) * (limit ?? 0))
      .limit(limit ?? 0);
    const total = await this.category.countDocuments();
    return {
      success: true,
      items: categories,
      total,
      page: page ?? 1,
      pages: limit ? Math.ceil(total / limit) : 1,
    };
  }

  async getCategoryById(id: string) {
    return this.category.findById(id).populate({
      path: 'parent',
      model: 'Category',
    });
  }

  async updateCategory(
    id: string,
    name?: string,
    description?: string,
    parent?: string,
  ) {
    try {
      const updateData: any = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (parent !== undefined) {
        updateData.parent = parent || null;
        updateData.level = parent
          ? ((await this.category.findById(parent))?.level ?? -1) + 1
          : 0;
      }
      const updatedCategory = this.category
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      return {
        success: true,
        category: updatedCategory,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  async deleteCategory(id: string) {
    try {
      // delete all the dependent categories
      await this.category.deleteMany({ parent: id }).exec();
      // delete the category
      await this.category.findByIdAndDelete(id).exec();
      return { success: true, message: 'Category and its subcategories deleted' }
    } catch (error) {
      console.log(error)
      return { success: false, message: error.message }
    }
  }
}
