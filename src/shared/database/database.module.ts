import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CategorySchema, { Category } from 'src/schemas/category';
import OrderSchema, { Order } from 'src/schemas/order.schema';
import ProductSchema, { Product } from 'src/schemas/product.schema';
import ReviewSchema, { Review } from 'src/schemas/reviews';
import UserSchema, { User } from 'src/schemas/user.schema';

const models = [
  { name: User.name, schema: UserSchema },
  {
    name: Product.name,
    schema: ProductSchema,
  },
  {
    name: Category.name,
    schema: CategorySchema,
  },
  {
    name: Order.name,
    schema: OrderSchema,
  },
  {
    name: Review.name,
    schema: ReviewSchema,
  },
];

const features = [
  MongooseModule.forRoot(process.env.MONGODB_URI!, {
    dbName: 'three-five-two',
  }),
  MongooseModule.forFeature(models),
];

@Global()
@Module({
  imports: [...features],
  exports: [...features],
})
export class DatabaseModule {}
