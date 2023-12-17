import {
  ProductionTime,
  ProductLike,
  Structure,
} from '../entities/product.entity';

export class UpdateProductDto {
  title?: string;
  images?: string[];
  videoUrl?: string;
  price?: number;
  finalPrice?: number;
  discount?: number;
  productionTime?: ProductionTime;
  structures?: Structure[];
  lengthSm?: number;
  heightSm?: number;
  description?: string;
  status?: string;
  reasonsForRejection?: string[];
  inStock?: boolean;

  viewCount?: number;
  favoritesCount?: ProductLike[];
  buyCount?: number;
  rating?: number;

  categories?: string[];
  shop?: string;
  relatedProducts?: string[] | null;
  feedbacks?: any[];
  averageRating?: number;
}
