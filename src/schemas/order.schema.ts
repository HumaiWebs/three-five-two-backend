import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  COD = 'cod',
}

enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
}

interface IPaymentDetails {
  method: PaymentMethod;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: [
      {
        productId: {
          type: Types.ObjectId,
          ref: Product.name || 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: IOrderProduct[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'pending' })
  status: OrderStatus;

  @Prop()
  shippingAddress: string;

  @Prop({ type: Object })
  paymentMethod: IPaymentDetails;
}

const OrderSchema = SchemaFactory.createForClass(Order);

export default OrderSchema;
