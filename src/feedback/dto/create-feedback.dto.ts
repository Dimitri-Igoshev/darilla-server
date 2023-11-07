import { FeedbackStatus } from '../entities/feedback.entity';

export class CreateFeedbackDto {
  service?: number;
  priceQuality?: number;
  delivery?: number;
  text: string;
  images?: string[];
  author: string;
  product: string;
  shop: string;
  status?: FeedbackStatus;
  isNew?: boolean;
}
