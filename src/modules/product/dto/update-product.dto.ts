import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class ProductImageDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  public_id: string;

  @ApiProperty()
  deleted?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false, type: ProductImageDto, isArray: true })
  images?: ProductImageDto[];
}
