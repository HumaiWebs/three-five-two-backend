import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private readonly category:Model<Category>){};

    async createCategory(name:string, description?:string, parent?:string){
        const level = parent ? ((await this.category.findById(parent))?.level ?? -1) + 1 : 0;
        const newCategory = await this.category.create({name, description, parent: parent || null, level});
        return {success:true, category:newCategory};
    }

    async getAllCategories(){
        return this.category.find();
    }

    async getCategoryById(id:string){
        return this.category.findById(id);
    }

    async updateCategory(id:string, name?:string, description?:string, parent?:string){
        const updateData:any = {};
        if(name) updateData.name = name;
        if(description) updateData.description = description;
        if(parent !== undefined){
            updateData.parent = parent || null;
            updateData.level = parent ? ((await this.category.findById(parent))?.level ?? -1) + 1 : 0;
        }
        return this.category.findByIdAndUpdate(id, updateData, {new:true}).exec();
    }

}
