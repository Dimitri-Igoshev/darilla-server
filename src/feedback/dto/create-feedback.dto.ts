export class CreateFeedbackDto {
  service?: number;
  priceQuality?: number;
  delivery?: number;
  text: string;
  images?: string[];
  author: string;
  product: string;
}
