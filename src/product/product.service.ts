import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';
import { ProductSort } from './enum/product-sort.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly fileService: FileService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(files: Express.Multer.File[], data: CreateProductDto) {
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

  updateFavorites = async ({ productId, add }) => {
    const product = await this.findOne(productId);

    return await this.update(productId, null, {
      favoriteCount: add
        ? product.favoriteCount
          ? product.favoriteCount + 1
          : 1
        : product.favoriteCount
        ? product.favoriteCount - 1
        : 0,
    });
  };
}
