import { FeedbackStatus } from '../entities/feedback.entity';

export class UpdateFeedbackDto {
  created?: Date;
  service?: number;
  priceQuality?: number;
  delivery?: number;
  text?: string;
  images?: string[];
  status?: FeedbackStatus;
  isNew?: boolean;
}
