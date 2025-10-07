import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() body: CreateCategoryDto
  ) {
    return this.categoryService.createCategory(body.name, body.description, body.parent);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; parent?: string }
  ) {
    return this.categoryService.updateCategory(id, body.name, body.description, body.parent);
  }
}
