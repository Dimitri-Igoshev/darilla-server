import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Schema()
export class Feedback {
  @Prop({
    type: Date,
    default: Date.now,
  })
  created: Date;

  @Prop({ type: Number })
  service: number;

  @Prop({ type: Number })
  priceQuality: number;

  @Prop({ type: Number })
  delivery: number;

  @Prop({ type: String })
  text: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  product: Product;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)
