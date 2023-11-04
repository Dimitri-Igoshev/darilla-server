import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  create(createFeedbackDto: CreateFeedbackDto) {
    return 'This action adds a new feedback';
  }

  findAll() {
    return `This action returns all feedback`;
  }

  findOne(id: string) {
    return `This action returns a #${id} feedback`;
  }

  update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: string) {
    return `This action removes a #${id} feedback`;
  }
}
