import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;
  @Prop()
  quantity: number;
  @Prop()
  images: string[];
  @Prop({type: [Types.ObjectId], ref: 'Review'})
  reviews: Types.ObjectId[];
  @Prop({ default: true })
  isActive: boolean;
}

const ProductSchema = SchemaFactory.createForClass(Product);

export default ProductSchema;
