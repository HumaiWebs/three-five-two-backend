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
  ) {
    return this.productService.get(page, limit);
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
  ) {
    return this.productService.updateProduct(id, dto, files);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
