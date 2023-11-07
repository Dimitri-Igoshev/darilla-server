import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackStatus } from './entities/feedback.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    private readonly fileService: FileService,
  ) {}

  async create(files: Express.Multer.File[], data: CreateFeedbackDto) {
    if (data.service == 1 || data.priceQuality == 1 || data.delivery == 1)
      data.status = FeedbackStatus.MODERATION;

    const newFeedback = new this.feedbackModel(data);
    const result = await newFeedback.save();

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
      .populate({ path: 'product', model: 'Product' })
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

  remove(id: string) {
    return this.feedbackModel.deleteOne({ _id: id }).exec();
  }
}
