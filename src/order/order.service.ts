import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus, TimeSort } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(order: CreateOrderDto) {
    const newOrder = new this.orderModel({ ...order, orderNumber: Date.now() })
    return newOrder.save()
  }

  findAll() {
    return this.orderModel.find().sort('-created').exec()
  }

  findByShopperId(id: string) {
    return this.orderModel.find({ shopper: id }).populate([
      { path: 'products', model: 'Product' },
      { path: 'shopper', model: 'User'}
    ]).sort('-created').exec()
  }

  findByShopId(id: string, status?: OrderStatus, sort?: TimeSort) {
    return this.orderModel.find({ shop: id }).populate([
      { path: 'products', model: 'Product' },
      { path: 'shopper', model: 'User'},
      { path: 'shop', model: 'Shop' },
    ]).sort('-created').exec()
  }

  findByCourierId(id: string) {
    return this.orderModel.find({ courier: id }).populate([
      { path: 'products', model: 'Product' },
      { path: 'shopper', model: 'User'}
    ]).sort('-created').exec()
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findOneAndUpdate({ _id: id }, { ...updateOrderDto }, { new: true }).exec()
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}