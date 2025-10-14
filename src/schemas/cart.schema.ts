import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop()
  userId: string;

  @Prop({ type: [{ productId: String, quantity: Number }] })
  items: { productId: string; quantity: number }[];

}

const CartSchema = SchemaFactory.createForClass(Cart);

export default CartSchema;
