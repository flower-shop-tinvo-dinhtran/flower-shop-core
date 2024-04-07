import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const PRODUCT_ERROR = {
  SLUG_EXISTED: 'SLUG_EXISTED',
  NAME_EXISTED: 'NAME_EXISTED',
};

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  name: string;

  @Prop()
  images: string[];

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  category: string[];

  @Prop()
  tags: string[];

  @Prop()
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
