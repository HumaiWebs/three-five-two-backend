import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  discount: number; // percentage or fixed amount

  @Prop()
  description: string;

  @Prop({ required: true })
  expiry: Date;

  @Prop({ default: 1 })
  usageLimit: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  validCategories: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  validProducts: Types.ObjectId[];
}

const CouponSchema = SchemaFactory.createForClass(Coupon);

export default CouponSchema;
