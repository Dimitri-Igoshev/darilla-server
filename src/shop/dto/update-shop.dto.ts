import { Status, TaxSystem } from '../entities/shop.entity';

export class UpdateShopDto {
  title: string;
  address: string;
  website?: string;
  description?: string;
  companyName?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  director?: string;
  legalAddress?: string;
  bank?: string;
  bik?: string;
  paymentAccount?: string;
  taxSystem?: TaxSystem;
  contract?: string;
  status?: Status;
}
