import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './entities/cart.entity';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly userService: UserService
  ) {}

  async create(cart: CreateCartDto) {
    cart.bonuses = cart.totalPrice / 100 * 5

    const newCart = new this.cartModel({...cart})
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
    )
  }

  remove(id: string) {
    return this.cartModel.deleteOne({ _id: id }).exec();
  }

  getFinalPrice = (price: number, discount: number): number => {
    return discount ? Math.round(((100 - discount) / 100) * price) : price
  }
}