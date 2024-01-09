import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './entities/cart.entity';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import YooKassa from 'yookassa-ts/lib/yookassa'
import { IAmount } from 'yookassa-ts/lib/types/Common';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly userService: UserService,
    private readonly orderService: OrderService
  ) { }

  async create(cart: CreateCartDto) {
    cart.bonuses = cart.totalPrice / 100 * 5

    const newCart = new this.cartModel({ ...cart })
    const res = await newCart.save()

    if (cart.user) await this.userService.addCart(cart.user, res._id.toString())

    return res;
  }

  // findAll() {
  //   return `This action returns all carts`;
  // }

  async findOne(id: string) {
    const user = await this.userService.getUserById(id)
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)

    return this.cartModel.findOne({ _id: user._id.toString() }).exec()
  }

  findOneByUserId(id: string) {
    return this.cartModel
      .findOne({ _id: id })
      .populate([
        { path: 'products', model: 'Product' },
        { path: 'shop', model: 'Shop' }
      ])
      .exec()
  }

  async update(id: string, data: UpdateCartDto) {
    if (data?.products[0]?.price) {
      data.totalPrice = 0

      data.products.forEach((i: any, idx: number) => {
        data.totalPrice += this.getFinalPrice(+i.price, +i.discount) * +data.quantities[idx]
      })
    }

    data.bonuses = data.totalPrice / 100 * 5

    return this.cartModel.findByIdAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    ).populate([
      { path: 'products', model: 'Product' },
      { path: 'shop', model: 'Shop' }
    ])
      .exec()
  }

  remove(id: string) {
    return this.cartModel.deleteOne({ _id: id }).exec();
  }

  getFinalPrice = (price: number, discount: number): number => {
    return discount ? Math.round(((100 - discount) / 100) * price) : price
  }

  yooKassa = new YooKassa({
    shopId: '295247',
    secretKey: 'test_XO295hI5Z3DDizoqI-gLgqvZgFMlX8azzNib3voZ2ss'
  });

  createPayment = async ({ sum, description, orderId }) => {
    const res = await this.yooKassa.createPayment({
      amount: {
        value: sum,
        // @ts-ignore
        currency: "RUB"
      },
      // payment_method_data: {
      //   // @ts-ignore
      //   type: "bank_card"
      // },
      // @ts-ignore
      confirmation: {
        type: "redirect",
        return_url: process.env.FE_URL
      },
      description
    });

    const order = await this.orderService.update(orderId, { paymentId: res.id })

    return res
  }

  capturePayment = async ({ paymentId, sum }) => {
    const amount: IAmount = {
      value: sum,
      // @ts-ignore
      currency: "RUB"
    }

    const res = await this.yooKassa.capturePayment(paymentId, amount)

    return res
  }
}