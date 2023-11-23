import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackStatus } from './entities/feedback.entity';
import { FileService } from '../file/file.service';
import { ProductService } from '../product/product.service';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    private readonly fileService: FileService,
    private readonly productService: ProductService,
    private readonly shopService: ShopService,
  ) {}

  async create(files: Express.Multer.File[], data: CreateFeedbackDto) {
    if (data.service == 1 || data.priceQuality == 1 || data.delivery == 1)
      data.status = FeedbackStatus.MODERATION;

    const newFeedback = new this.feedbackModel(data);
    const result = await newFeedback.save();

    const product = await this.productService.findOne(data.product);
    const averageRating =
      (+data.service + +data.priceQuality + +data.delivery) / 3;

    const productAverageRating = product.averageRating
      ? (product.averageRating * product.feedbacks.length + averageRating) /
        (product.feedbacks.length + 1)
      : averageRating;

    await this.productService.update(data.product, null, {
      feedbacks: [...product.feedbacks, result._id],
      averageRating: productAverageRating,
    });

    const products = await this.productService.findAll(data.shop);
    const shop = await this.shopService.getShopById(data.shop);

    const productsWithAverage = products.filter((p) => p.averageRating);
    const shopAverageRating = shop.averageRating
      ? (shop.averageRating * productsWithAverage.length + averageRating) /
        (productsWithAverage.length + 1)
      : averageRating;

    await this.shopService.updateShop(data.shop, {
      averageRating: +shopAverageRating,
    });

    if (!files?.length) return result;

    const media = await this.fileService.saveFile(files);
    if (!media?.length) return result;

    const urls = media.map((el) => el.url);
    const imageUrls = urls.filter((i) => i.includes('-xl.webp'));

    return this.feedbackModel.findByIdAndUpdate(
      { _id: result._id },
      { images: imageUrls },
      { new: true },
    );
  }

  findAll() {
    return this.feedbackModel
      .find()
      .populate({ path: 'author', model: 'User' })
      .sort({ created: -1 })
      .exec();
  }

  findByProductId(id: string) {
    return this.feedbackModel
      .find({ product: id })
      .populate({ path: 'author', model: 'User' })
      .sort({ created: -1 })
      .exec();
  }

  findByAuthorId(id: string) {
    return this.feedbackModel
      .find({ author: id })
      .populate([
        { path: 'product', model: 'Product' },
        { path: 'author', model: 'User' },
      ])
      .sort({ created: -1 })
      .exec();
  }

  findByShopId(id: string) {
    return this.feedbackModel
      .find({ shop: id })
      .populate({ path: 'author', model: 'User' })
      .sort({ created: -1 })
      .exec();
  }

  findOne(id: string) {
    return this.feedbackModel
      .findOne({ _id: id })
      .populate({ path: 'author', model: 'User' })
      .exec();
  }

  async update(
    id: string,
    files: Express.Multer.File[],
    data: UpdateFeedbackDto,
  ) {
    if (data.service == 1 || data.priceQuality == 1 || data.delivery == 1)
      data.status = FeedbackStatus.MODERATION;

    const result = await this.feedbackModel
      .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .exec();

    if (!files?.length) return result;

    const media = await this.fileService.saveFile(files);
    if (!media?.length) return result;

    const urls = media.map((el) => el.url);
    const imageUrls = urls.filter((i) => i.includes('-xl.webp'));

    return this.feedbackModel.findByIdAndUpdate(
      { _id: result._id },
      { images: [...result.images, ...imageUrls] },
      { new: true },
    );
  }

  async remove(id: string) {
    const feedback = await this.feedbackModel.findOne({ _id: id }).exec();

    const product = await this.productService.findOne(
      feedback.product.toString(),
    );
    await this.productService.update(product._id.toString(), null, {
      feedbacks: product.feedbacks
        .filter((f) => f.toString() !== id)
        .map((i) => i.toString()),
    });

    return this.feedbackModel.deleteOne({ _id: id }).exec();
  }
}
