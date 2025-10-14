import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

export type ProductDocument = HydratedDocument<Product>;

export type Image = {
  url: string;
  public_id: string;
  deleted?: boolean;
};

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;
  @Prop({ unique: true })
  slug: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;
  @Prop()
  quantity: number;
  @Prop({ type: Array, default: [] })
  images: Image[];
  @Prop({ type: [Types.ObjectId], ref: 'Review',default: [] })
  reviews: Types.ObjectId[];
  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      name: String,
      description: String,
      og: {
        name: String,
        description: String,
        image: String,
      },
    },
  })
  seo: {
    name?: string;
    description?: string;
    og?: {
      name?: string;
      description?: string;
      image?: string;
    };
  };

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

}

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export default ProductSchema;
