import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private readonly cart: Model<Cart>) {}

  async addItemToCart({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    try {
      const cart = await this.createCartIfNotExists(userId);
      const itemPresent = cart.items.find((item) => item.product === productId);

      if (itemPresent) {
        itemPresent.quantity = quantity;
        await cart.save();
        return { success: true, message: 'Item quantity updated in cart' };
      }

      cart.items.push({ product: productId, quantity });
      await cart.save();
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await this.cart.findOne({ userId });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to clear cart' };
    }
  }

  async getCart(userId: string) {
    return this.cart.findOne({ userId });
  }

  async removeItemFromCart({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    try {
      const cart = await this.cart.findOne({ userId });
      if (!cart) {
        return { success: false, message: 'Cart not found' };
      }
      cart.items = cart.items.filter((item) => item.product !== productId);
      await cart.save();
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  }

  async createCartIfNotExists(userId: string) {
    let cart = await this.cart.findOne({ userId });
    if (!cart) {
      cart = new this.cart({ userId, items: [] });
      await cart.save();
    }
    return cart;
  }

  async getUserCart(userId: string) {
    try {
      const cart = await this.cart.findOne({ userId }).populate({
        path: 'items.product',
        model: 'Product',
        select: '_id name price images slug',
      });
      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to retrieve cart' };
    }
  }
}
