import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async createCategory(
    @Body() body: CreateCategoryDto
  ) {
    return this.categoryService.createCategory(body.name, body.description, body.parent);
  }

  @Get()
  async getAllCategories(@Query('page') page: number = 1, @Query('limit') limit?: number) {
    return this.categoryService.getAllCategories(page, limit);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; parent?: string }
  ) {
    return this.categoryService.updateCategory(id, body.name, body.description, body.parent);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
