import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dtos';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('')
  async addItemToCart(@Body() body: AddItemToCartDto) {
    return this.cartService.addItemToCart(body);
  }

  @Get('/:userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @Delete('/:userId/:productId')
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItemFromCart({ userId, productId });
  }

  @Delete('clear/my-cart/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
