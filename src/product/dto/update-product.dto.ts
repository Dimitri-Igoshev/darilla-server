import { ProductionTime, Structure } from '../entities/product.entity';

export class UpdateProductDto {
  title?: string;
  imageUrls?: string[];
  mainImageUrl?: string;
  price?: number;
  discount?: number;
  productionTime?: ProductionTime;
  structures?: Structure[];
  lengthSm?: number;
  heightSm?: number;
  description?: string;
  status?: string;
  inStock?: boolean;

  viewCount?: number;
  favoriteCount?: number;
  buyCount?: number;

  categories?: string[];
  shop?: string;
  relatedProducts?: string[];
}
