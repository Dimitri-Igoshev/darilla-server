import { Status, TaxSystem } from '../entities/shop.entity';

export class UpdateShopDto {
  title: string;
  logoUrl?: string;
  address: string;
  phone?: string;
  weekStart?: string;
  weekEnd?: string;
  satStart?: string;
  satEnd?: string;
  sunStart?: string;
  sunEnd?: string;
  aroundTheClock?: boolean;
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
  correspondentAccount?: string;
  taxSystem?: TaxSystem;
  contract?: string;
  status?: Status;
  mainShop?: string;
  branches?: string[];
}
