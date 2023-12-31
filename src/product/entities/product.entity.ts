import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Shop } from '../../shop/entities/shop.entity';
import { Category } from '../../category/entities/category.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';

export interface Image {
  url: string;
  main: boolean;
  rank: number;
}

export interface Structure {
  title: string;
  quantity: number;
}

export interface ProductLike {
  createdAt: Date;
  user: string;
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
  @Prop({
    type: Date,
    default: Date.now,
  })
  created: Date;

  @Prop({ type: String })
  title: string;

  @Prop({ type: [Object] })
  images: Image[];

  @Prop({ type: String })
  videoUrl: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  finalPrice: number;

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

  @Prop({ type: Number })
  rating: number;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.MODERATION,
  })
  status: ProductStatus;

  @Prop({ type: [String] })
  reasonsForRejection: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }])
  feedbacks: Feedback[];

  @Prop({ type: Number })
  averageRating: number;

  @Prop({ type: Boolean, default: false })
  inTop: boolean;

  @Prop({ type: Boolean, default: true })
  inStock: boolean;

  @Prop({ type: Number })
  viewCount: number;

  @Prop({ type: [Object] })
  favoritesCount: ProductLike[];

  @Prop({ type: Number })
  buyCount: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
  categories: Category[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  })
  shop: Shop;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', null: true }])
  relatedProducts: Product[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
