import { ProductionTime, Structure } from '../entities/product.entity';

export class CreateProductDto {
  title: string;
  price: number;
  discount?: number;
  productionTime?: ProductionTime;
  structures?: Structure[];
  lengthSm?: number;
  heightSm?: number;
  description?: string;
  status?: string;
  inStock?: boolean;
  categories: string[];
  shop: string;
  relatedProducts?: string[];
}
