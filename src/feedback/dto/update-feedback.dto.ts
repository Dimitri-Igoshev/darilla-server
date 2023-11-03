export class UpdateFeedbackDto {
  created?: Date;
  service?: number;
  priceQuality?: number;
  delivery?: number;
  text?: string;
  images?: string[];
}
