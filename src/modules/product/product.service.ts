import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getProductCacheKey } from 'src/shared/cache/keys';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly product: Model<Product>,
    private readonly cloudinary: CloudinaryService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async create(dto: CreateProductDto, files: Express.Multer.File[]) {
    try {
      // handle images
      const uploadedImages = await this.cloudinary.uploadImages(files);
      const imageLinks = uploadedImages.map((uploadedImage) => ({
        url: uploadedImage?.['secure_url'],
        public_id: uploadedImage?.['public_id'],
      }));

      const exists = await this.product.findOne({
        name: dto.name,
        deleted: false,
      });

      if (exists) {
        return {
          success: false,
          message: 'Product with this name already exists',
        };
      }
      const newProduct = await this.product.create({
        ...dto,
        images: imageLinks,
      });

      if (newProduct.featured) {
        const featuredProducts = await this.product.find({
          featured: true,
          deleted: false,
        });
        await this.cache.set('featured-products', featuredProducts);
      }

      return { success: true, product: newProduct };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  async get(page: number, limit: number) {
    const products = await this.product
      .find({ deleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.product.countDocuments({ deleted: false });
    return {
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string) {
    return this.product.findById(id).where({ deleted: false });
  }

  async getFeaturedProducts() {
    const cached = await this.cache.get('featured-products');
    if (cached) {
      return { success: true, products: cached };
    }
    const products = await this.product.find({
      featured: true,
      deleted: false,
    });
    await this.cache.set('featured-products', products);
    return { success: true, products };
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    try {
      if (dto.images && dto.images.length > 0) {
        dto.images = dto.images.filter((img) => !img.deleted);
      }

      if (files && files.length > 0) {
        // handle images
        const uploadedImages = await this.cloudinary.uploadImages(files);
        const imageLinks = uploadedImages.map((uploadedImage) => ({
          url: uploadedImage?.['secure_url'],
          public_id: uploadedImage?.['public_id'],
        }));
        dto.images = [...(dto.images || []), ...imageLinks];
      }

      const updatedProduct = await this.product.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!updatedProduct) {
        return { success: false, message: 'Product not found' };
      }

      if (dto.featured) {
        const featuredProducts = await this.product.find({
          featured: true,
          deleted: false,
        });
        await this.cache.set('featured-products', featuredProducts);
      } else {
        const cachedFeatured = (await this.cache.get(
          'featured-products',
        )) as Product[];
        if (cachedFeatured) {
          const updatedCache = cachedFeatured.filter(
            (p) => (p as any)._id.toString() !== id,
          );
          await this.cache.set('featured-products', updatedCache);
        }
      }

      return { success: true, product: updatedProduct };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  async deleteProduct(id: string) {
    try {
      const deletedProduct = await this.product.findByIdAndUpdate(
        id,
        { deleted: true },
        {
          new: true,
        },
      );
      if (!deletedProduct) {
        return { success: false, message: 'Product not found' };
      }
      return { success: true, product: deletedProduct };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }
}
