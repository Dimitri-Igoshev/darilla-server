import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './entities/shop.entity';
import { UserService } from '../user/user.service';
import { UpdateShopDto } from './dto/update-shop.dto';
import { MFile } from '../file/mfile.class';
import { FileService } from '../file/file.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  async createShop(shop: CreateShopDto) {
    const isExist = await this.shopModel.findOne({ title: shop.title });

    if (isExist)
      throw new HttpException(
        'Shop with this title is already exists',
        HttpStatus.CONFLICT,
      );
    const newShop = new this.shopModel({ ...shop, contract: Date.now() });
    const res = await newShop.save();

    await this.userService.addShop(shop.owner, res._id.toString());

    return res;
  }

  async updateShop(id: string, shop: UpdateShopDto) {
    return this.shopModel
      .findOneAndUpdate({ _id: id }, { ...shop }, { new: true })
      .exec();
  }

  getShops() {
    return this.shopModel.find();
  }

  getShopById(id: string) {
    return this.shopModel.findOne({ _id: id }).exec();
  }

  async uploadLogo(id: string, file: MFile): Promise<any> {
    const res = await this.fileService.saveFile([file]);

    if (res[0].url) {
      return this.shopModel.findOneAndUpdate(
        { _id: id },
        { logoUrl: res[0].url },
        { new: true },
      );
    }

    return false;
  }

  async uploadDoc(id: string, doc: string, file: Express.Multer.File) {
    const res = await this.fileService.saveFile([file]);

    if (res[0].url) {
      return this.shopModel.findOneAndUpdate(
        { _id: id },
        { [doc]: res[0].url },
        { new: true },
      );
    }

    return false;
  }
}
