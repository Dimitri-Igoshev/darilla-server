import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/product/entities/product.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { User } from "src/user/entities/user.entity";

export type ProductQuantity = {
  productId: string;
  quantity: number;
}

@Schema()
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  products: Product[]

  @Prop({ type: [Object] })
  quantities: ProductQuantity[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  shop: Shop

  @Prop({ type: Number })
  totalPrice: number

  @Prop({ type: Number })
  deliveryPrice: number

  @Prop({ type: Number })
  bonuses: number

  @Prop({ type: String })
  postCardText: string

  @Prop({ type: String })
  address: string;

  @Prop({ type: Date })
  deliveryDate: Date

  @Prop({ type: String })
  deliveryTime: String

  @Prop({ type: String })
  recipient: String

  @Prop({ type: String })
  paymentMethod: String
}

export const CartSchema = SchemaFactory.createForClass(Cart)