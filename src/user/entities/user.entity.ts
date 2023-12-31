import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Shop } from '../../shop/entities/shop.entity';
import * as mongoose from 'mongoose';
import { Product } from '../../product/entities/product.entity';
import { Feedback } from '../../feedback/entities/feedback.entity'
import { Cart } from 'src/cart/entities/cart.entity';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  SUPPORT = 'SUPPORT',
  SELLER = 'SELLER',
  SALES_PERSON = 'SALES_PERSON',
  COURIER = 'COURIER',
}

export enum Status {
  PADDING = 'PADDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  patronymic: string;

  @Prop()
  photo: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  acceptingOrders: boolean;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  geoLat: string;

  @Prop()
  geoLon: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  favorites: Product[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }])
  feedbacks: Feedback[];

  @Prop({ type: [String], enum: Role, default: Role.USER })
  roles: Role[];

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }])
  shops: Shop[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cart: Cart;

  @Prop()
  refreshToken: string;

  @Prop()
  resetToken: string;

  @Prop()
  confirmToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
