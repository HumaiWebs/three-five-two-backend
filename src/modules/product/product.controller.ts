import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Param,
  Delete,
  Get,
  Query,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseJsonPipe } from 'src/pipes/parse-json.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  @UsePipes(new ParseJsonPipe(['seo']))
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(dto, files);
  }

  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') query?: string,
    @Query('featured') featured?: string,
  ) {
    return this.productService.get({
      page,
      limit,
      query,
      featured: featured === 'true',
    });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get('featured')
  async getFeaturedProducts() {
    return this.productService.getFeaturedProducts();
  }

  @UseInterceptors(FilesInterceptor('images'))
  @Put(':id')
  @UsePipes(new ParseJsonPipe(['images']))
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    // @UploadedFile('ogImage') ogImage: Express.Multer.File,
  ) {
    return this.productService.updateProduct(id, dto, files);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Put('featured/:id')
  async toggleFeatured(@Body() featured: boolean, @Param('id') id: string) {
    return this.productService.updateFeatureStatus(id, featured);
  }

  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @Get('simmilar/:id')
  async getSimmilarProducts(
    @Param('id') id: string,
    @Query('category') category: string,
    @Query('name') name: string,
  ) {
    return this.productService.getSimmilarProducts(id, category, name);
  }
}
