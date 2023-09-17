import { Status, TaxSystem } from '../entities/shop.entity';

export class UpdateShopDto {
  title: string;
  logoUrl?: string;
  address: string;
  weekStart?: string;
  weekEnd?: string;
  weekendStart?: string;
  weekendEnd?: string;
  website?: string;
  emailInfo?: string;
  emailDocs?: string;
  description?: string;
  descriptionFull?: string;
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
