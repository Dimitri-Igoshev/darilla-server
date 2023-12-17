import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';
import { ProductSort } from './enum/product-sort.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly fileService: FileService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(files: Express.Multer.File[], data: CreateProductDto) {
    data.finalPrice = data.discount ? Math.round(((100 - data.discount) / 100) * data.price) : data.price
    const newProduct = new this.productModel(data);
    const result = await newProduct.save();

    if (files?.length) {
      const media = await this.fileService.saveFile(files);

      // if (media?.length) {
      //   const media = await this.fileService.saveFile(files);

      if (media?.length) {
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
      // }
    }

    return result;
  }

  getSortStr(sort: ProductSort): any[] | any {
    switch (sort) {
      case ProductSort.POPULAR:
        return [['favoriteCount', -1]];
      case ProductSort.RATING:
        return [['averageRating', -1]];
      case ProductSort.PRICE_INCREASE:
        return [['price', 1]];
      case ProductSort.PRICE_DECREASE:
        return [['price', -1]];
      case ProductSort.NEW:
        return { _id: -1 };
      case ProductSort.DISCOUNT:
        return [[sort, -1]];
      default:
        return [[]];
    }
  }

  async findAll(
    shop?: string,
    category?: string,
    slug?: string,
    status?: string,
    search?: string,
    minprice?: string,
    maxprice?: string,
    sort?: ProductSort,
    limit?: string,
  ) {
    const filter: any = {};
    if (shop) filter.shop = shop;
    if (category) filter.categories = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    if (slug) {
      const category = await this.categoryService.findOneBySlug(slug);
      if (category) filter.categories = category._id;
    }
    // Model.find().skip((pageNumber-1)*limit).limit(limit).exec()
    return this.productModel
      .find(filter)
      .where('price')
      .gt(minprice ? +minprice - 1 : 0)
      .lt(maxprice ? +maxprice + 1 : 9999999)
      .sort(this.getSortStr(sort))
      .limit(+limit)
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
    data.finalPrice = data.discount ? Math.round(((100 - data.discount) / 100) * data.price) : data.price
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

  updateFavorites = async ({ userId, productId }) => {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    const product = await this.findOne(productId);

    if (!product || !user)
      throw new NotFoundException('Пользователь или товар не найден');

    const alreadyAdded = !!user.favorites.find(
      (item) => item.toString() === productId,
    );

    const favorites: Product[] = alreadyAdded
      ? user.favorites.filter((item) => item.toString() !== productId)
      : [productId, ...user.favorites];
    const favoritesCount = alreadyAdded
      ? product.favoritesCount.filter((item) => item.user !== userId)
      : [
          { createdAt: new Date(Date.now()), user: userId },
          ...product.favoritesCount,
        ];

    await this.userModel
      .findOneAndUpdate({ _id: userId }, { favorites })
      .exec();

    return await this.update(productId, null, { favoritesCount });
  };
}
