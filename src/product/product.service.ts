import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly fileService: FileService,
  ) {}

  async create(files: Express.Multer.File[], data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    const result = await newProduct.save();

    if (files?.length) {
      const media = await this.fileService.saveFile(files);

      if (media?.length) {
        let imageUrls = media.map((el) => el.url);
        imageUrls = imageUrls.filter((i) => i.includes('-xl.webp'));

        return this.productModel
          .findOneAndUpdate(
            { _id: result._id },
            { imageUrls, mainImageUrl: imageUrls[0] },
            { new: true },
          )
          .exec();
      }
    }

    return result;
  }

  findAll(shop: string, category: string, status: string, search: string) {
    const filter: any = {};
    if (shop) filter.shop = shop;
    if (category) filter.categories = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Model.find().skip((pageNumber-1)*limit).limit(limit).exec()
    return this.productModel.find(filter).limit(20).exec();
  }

  findOne(id: string) {
    return this.productModel.find({ _id: id }).exec();
  }

  async update(
    id: string,
    files: Express.Multer.File[],
    data: UpdateProductDto,
  ) {
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .exec();

    if (files.length) {
      const media = await this.fileService.saveFile(files);

      if (media.length) {
        let imageUrls = media.map((el) => el.url);
        imageUrls = imageUrls.filter((i) => i.includes('-xl.webp'));

        return this.productModel
          .findOneAndUpdate(
            { _id: result._id },
            {
              imageUrls: [...result.imageUrls, ...imageUrls],
              mainImageUrl: imageUrls[0],
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
}
