import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { FileService } from '../file/file.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  async create(files: Express.Multer.File[], data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    const result = await newProduct.save();

    if (files?.length) {
      const media = await this.fileService.saveFile(files);

      if (media?.length) {
        const media = await this.fileService.saveFile(files);

        if (media.length) {
          const urls = media.map((el) => el.url);
          const imageUrls = urls.filter((i) => i.includes('-xl.webp'));
          const videoUrl = urls.filter((i) => i.includes('video'));

          const images = imageUrls.map((i: string) => ({
            url: i,
            main: false,
            rank: 0,
          }));

          images[0].main = true;

          return this.productModel
            .findOneAndUpdate(
              { _id: result._id },
              {
                images: [...images],
                videoUrl: videoUrl[0],
              },
              { new: true },
            )
            .exec();
        }
      }
    }

    return result;
  }

  findAll(
    shop: string,
    category: string,
    status: string,
    search: string,
    limit: string,
  ) {
    const filter: any = {};
    if (shop) filter.shop = shop;
    if (category) filter.categories = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Model.find().skip((pageNumber-1)*limit).limit(limit).exec()
    return this.productModel
      .find(filter)
      .limit(+limit || 10)
      .exec();
  }

  findOne(id: string) {
    return this.productModel
      .findOne({ _id: id })
      .populate([
        { path: 'relatedProducts', model: 'Product' },
        { path: 'shop', model: 'Shop' },
      ])
      .exec();
  }

  async update(
    id: string,
    files: Express.Multer.File[],
    data: UpdateProductDto,
  ) {
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .exec();

    if (files?.length) {
      const media = await this.fileService.saveFile(files);

      if (media.length) {
        const urls = media.map((el) => el.url);
        const imageUrls = urls.filter((i) => i.includes('-xl.webp'));
        const videoUrl = urls.filter((i) => i.includes('video'));

        const images = imageUrls.map((i: string) => ({
          url: i,
          main: false,
          rank: 0,
        }));

        images[0].main = true;

        return this.productModel
          .findOneAndUpdate(
            { _id: result._id },
            {
              images: [...result.images, ...images],
              videoUrl: videoUrl[0],
            },
            { new: true },
          )
          .exec();
      }
    }

    return result;
  }

  remove(id: string) {
    return this.productModel.deleteOne({ _id: id }).exec();
  }

  updateMainImage = async ({ id, url }) => {
    const product = await this.productModel.findOne({ _id: id }).exec();
    if (!product) return;

    const productImages = [...product.images];
    productImages.forEach((i) => {
      i.main = i.url === url;
    });

    return this.productModel
      .findOneAndUpdate({ _id: id }, { images: productImages }, { new: true })
      .exec();
  };

  updateFavorites = async ({ productId, userId }) => {
    const user = await this.userService.getUserById(userId);

    const favorites = user.favorites.includes(productId)
      ? user.favorites.filter((i: Product | any) => i.toString() !== productId)
      : [...user.favorites, productId];

    return this.userService.updateUser(userId, { favorites }, null);
  };
}
