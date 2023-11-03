import { Product, ProductionTime, Structure } from '../entities/product.entity'
import { Prop } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export class UpdateProductDto {
  title?: string;
  images?: string[];
  videoUrl?: string;
  price?: number;
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
  favoriteCount?: number;
  buyCount?: number;
  rating?: number;

  categories?: string[];
  shop?: string;
  relatedProducts?: string[] | null;
  feedbacks?: string[];
}
