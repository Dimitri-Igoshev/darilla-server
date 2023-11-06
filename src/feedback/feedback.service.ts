import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './entities/feedback.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    private readonly fileService: FileService,
  ) {}

  async create(
    files: Express.Multer.File[],
    createFeedbackDto: CreateFeedbackDto,
  ) {
    const newFeedback = new this.feedbackModel(createFeedbackDto);
    const result = await newFeedback.save();

    if (!files?.length) return result;

    const media = await this.fileService.saveFile(files);
    if (!media?.length) return result;

    const urls = media.map((el) => el.url);
    return this.feedbackModel.findByIdAndUpdate(
      { id: result._id },
      { images: urls },
      { new: true },
    );
  }

  findAll() {
    return this.feedbackModel.find().exec();
  }

  findByProductId(id: string) {
    return this.feedbackModel
      .find({ product: id })
      .populate({ path: 'author', model: 'User' })
      .exec();
  }

  findByAuthorId(id: string) {
    return this.feedbackModel
      .find({ author: id })
      .populate({ path: 'product', model: 'Product' })
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
    updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const result = await this.feedbackModel
      .findOneAndUpdate({ _id: id }, { ...updateFeedbackDto }, { new: true })
      .exec();

    if (!files?.length) return result;

    const media = await this.fileService.saveFile(files);
    if (!media?.length) return result;

    const urls = media.map((el) => el.url);
    return this.feedbackModel.findByIdAndUpdate(
      { id: result._id },
      { images: urls },
      { new: true },
    );
  }

  remove(id: string) {
    return this.feedbackModel.deleteOne({ _id: id }).exec();
  }
}
