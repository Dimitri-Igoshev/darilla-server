import { Recipient } from "../entities/order.entity"

export class CreateOrderDto {
  orderNumber?: string
  status?: string
  shop: string
  shopper?: string
  products: string[]
  quantities: number[]
  postCardText?: string
  deliveryAddress?: string
  deliveryDateTime?: string
  recipient?: Recipient
  deliveryPrice: number
  sum: number
  bonuses?: number
  paymentId?: string
  paymentStatus: string
  courier?: string
}
