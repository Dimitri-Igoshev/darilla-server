import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Shop } from '../../shop/entities/shop.entity';
import { Category } from '../../category/entities/category.entity';

export interface Structure {
  title: string;
  quantity: number;
}

export enum Period {
  SECONDS = 'SECONDS',
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

export interface ProductionTime {
  quantity: number;
  period: Period;
}

export enum ProductStatus {
  MODERATION = 'MODERATION',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  BLOCKED = 'BLOCKED',
}

@Schema()
export class Product {
  @Prop({ type: String })
  title: string;

  @Prop({ type: [String] })
  imageUrls: string[];

  @Prop({ type: String })
  mainImageUrl: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  discount: number;

  @Prop({ type: Object })
  productionTime: ProductionTime;

  @Prop({ type: [Object] })
  structures: Structure[];

  @Prop({ type: Number })
  lengthSm: number;

  @Prop({ type: Number })
  heightSm: number;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.MODERATION,
  })
  status: ProductStatus;

  @Prop({ type: Boolean, default: false })
  inTop: boolean;

  @Prop({ type: Boolean, default: true })
  inStock: boolean;

  @Prop({ type: Number })
  viewCount: number;

  @Prop({ type: Number })
  favoriteCount: number;

  @Prop({ type: Number })
  buyCount: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
  categories: Category[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  })
  shop: Shop;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  relatedProducts: Product[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
