import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/schemas/cart.schema';
import { CartItem } from './interfaces/cart-item';

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
      cart.items.push({ productId, quantity });
      await cart.save();
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }

  async getCart(userId: string) {
    return this.cart.findOne({ userId });
  }

  async updateItemQuantity({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    try {
      const cart = await this.cart.findOne({ userId });
      if (!cart) {
        return { success: false, message: 'Cart not found' };
      }
      const item = cart.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
        return { success: true, message: 'Item quantity updated' };
      } else {
        return { success: false, message: 'Item not found in cart' };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to update item quantity' };
    }
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
      cart.items = cart.items.filter((item) => item.productId !== productId);
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
    return this.cart.findOne({ userId });
  }
}
