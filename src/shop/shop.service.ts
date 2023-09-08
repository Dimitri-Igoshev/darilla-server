import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './entities/shop.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    private readonly userService: UserService,
  ) {}

  async createShop(shop: CreateShopDto) {
    const isExist = await this.shopModel.findOne({ title: shop.title });

    if (isExist)
      throw new HttpException(
        'Shop with this title is already exists',
        HttpStatus.CONFLICT,
      );
    const newShop = new this.shopModel(shop);
    const res = await newShop.save();

    await this.userService.addShop(shop.owner, res._id.toString());

    return res;
  }

  getShops() {
    return this.shopModel.find();
  }
}
