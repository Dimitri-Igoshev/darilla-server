import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(order: CreateOrderDto) {
    const newOrder = new this.orderModel({ ...order, orderNumber: Date.now() })
    return newOrder.save()
  }

  findAll() {
    return this.orderModel.find().exec()
  }

  findByShopperId(id: string) {
    return this.orderModel.find({ shopper: id }).populate([
      { path: 'products', model: 'Product' },
      { path: 'shopper', model: 'User'}
    ]).exec()
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
