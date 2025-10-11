import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  Put,
  UsePipes,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseJsonPipe } from 'src/pipes/parse-json.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(FilesInterceptor('images'), FilesInterceptor('ogImage', 1))
  @Post()
  @UsePipes(new ParseJsonPipe(['seo']))
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @UploadedFile('ogImage') ogImage: Express.Multer.File,
  ) {
    return this.productService.create(dto, files, ogImage);
  }

  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') query?: string,
  ) {
    return this.productService.get(page, limit, query);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get('featured')
  async getFeaturedProducts() {
    return this.productService.getFeaturedProducts();
  }

  @UseInterceptors(FilesInterceptor('images'), FilesInterceptor('ogImage', 1))
  @Put(':id')
  @UsePipes(new ParseJsonPipe(['images']))
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @UploadedFile('ogImage') ogImage: Express.Multer.File,
  ) {
    return this.productService.updateProduct(id, dto, files, ogImage);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Put('featured/:id')
  async toggleFeatured(@Body() featured: boolean, @Param('id') id: string) {
    return this.productService.updateFeatureStatus(id, featured);
  }
}
