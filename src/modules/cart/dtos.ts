import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCartDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  quantity: number;
}