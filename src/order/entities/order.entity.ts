import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "src/product/entities/product.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { User } from "src/user/entities/user.entity";

export enum OrderStatus {
  PADDING = 'PADDING',
  PREPARE = 'PREPARE',
  DELIVERY = 'DELIVERY',
  DELIVERED = 'DELIVERED'
}

export enum PaymentStatus {
  PADDING = 'PADDING',
  SUCCEEDED = 'SUCCEEDED'
}

export enum TimeSort {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

export type Recipient = {
  firstName: string
  lastName: string
  phone: string
}

@Schema()
export class Order {
  @Prop({
    type: Date,
    default: Date.now,
  })
  created: Date;

  @Prop({
    type: Date
  })
  delivered: Date;

  @Prop({ type: String })
  orderNumber: string

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PADDING })
  status: OrderStatus

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  shop: Shop

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  shopper: User

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  products: Product[]

  @Prop({ type: [Number] })
  quantities: number[]

  @Prop({ type: String })
  postCardText: string

  @Prop({ type: String })
  deliveryAddress: string

  @Prop({ type: String })
  deliveryDateTime: string

  @Prop({ type: Object })
  recipient: Recipient

  @Prop({ type: Number })
  deliveryPrice: number

  @Prop({ type: Number })
  sum: number

  @Prop({ type: Number })
  bonuses: number

  @Prop({ type: String })
  paymentId: string

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PADDING })
  paymentStatus: PaymentStatus

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  courier: User
}

export const OrderSchema = SchemaFactory.createForClass(Order)