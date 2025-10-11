import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  images: { url: string; public_id: string }[];
  @ApiProperty({ default: false })
  featured: boolean;
  @ApiProperty({ required: false })
  seo?: {
    name?: string;
    description?: string;
    og?: {
      name?: string;
      description?: string;
    };
  };
}
