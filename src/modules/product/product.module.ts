import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService,CloudinaryService],
})
export class ProductModule {}
