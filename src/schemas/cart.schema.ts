import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop()
  userId: string;

  @Prop({ type: [{ product: String, quantity: Number }] })
  items: { product: string; quantity: number }[];

}

const CartSchema = SchemaFactory.createForClass(Cart);

export default CartSchema;
