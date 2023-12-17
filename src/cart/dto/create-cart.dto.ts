import { ProductQuantity } from "../entities/cart.entity"

export class CreateCartDto {
  user?: string;
  products?: any[]
  quantities?: ProductQuantity[]
  shop?: any
  deliveryPrice?: number
  bonuses?: number
  totalPrice?: number
  postCardText?: string
  address?: string;
  deliveryDate?: Date
  deliveryTime?: String
  recipient?: String
  paymentMethod?: String
}