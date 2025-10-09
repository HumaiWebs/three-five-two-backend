import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent: Types.ObjectId | null;

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: true })
  isActive: boolean;
}

const CategorySchema = SchemaFactory.createForClass(Category);

// Add index for better query performance
CategorySchema.index({ parent: 1 });
CategorySchema.index({ level: 1 });

export default CategorySchema;
