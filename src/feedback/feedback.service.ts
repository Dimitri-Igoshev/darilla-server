import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './entities/feedback.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    private readonly productService: ProductService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    // const product = await this.productService.findOne(
    //   createFeedbackDto.product,
    // );
    //
    // await this.productService.update(createFeedbackDto.product, null, {
    //   feedbacks: [feedback._id, ...product.feedbacks],
    // });

    return await new this.feedbackModel(createFeedbackDto).save();
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

  update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackModel
      .findOneAndUpdate({ _id: id }, { ...updateFeedbackDto }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.feedbackModel.deleteOne({ _id: id }).exec();
  }
}
