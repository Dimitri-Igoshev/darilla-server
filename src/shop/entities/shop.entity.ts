import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type ShopDocument = HydratedDocument<Shop>;

export type Address = {
  zip: string;
  country: string;
  region: string;
  city: string;
  address: string;
};

export enum Status {
  PADDING = 'PADDING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  BLOCKED = 'BLOCKED',
}

export enum TaxSystem {
  GENERAL = 'общая',
  SIMPLIFIED = 'упрощенная',
}

@Schema()
export class Shop {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  logoUrl: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  weekStart: string;

  @Prop({ type: String })
  weekEnd: string;

  @Prop({ type: String })
  satStart: string;

  @Prop({ type: String })
  satEnd: string;

  @Prop({ type: String })
  sunStart: string;

  @Prop({ type: String })
  sunEnd: string;

  @Prop({ type: Boolean, default: false })
  aroundTheClock: boolean;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String })
  emailInfo: string;

  @Prop({ type: String })
  emailDocs: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  descriptionFull: string;

  @Prop({ type: String })
  companyName: string;

  @Prop({ type: String })
  inn: string;

  @Prop({ type: String })
  kpp: string;

  @Prop({ type: String })
  ogrn: string;

  @Prop({ type: String })
  director: string;

  @Prop({ type: String })
  legalAddress: string;

  @Prop({ type: String })
  bank: string;

  @Prop({ type: String })
  bik: string;

  @Prop({ type: String })
  paymentAccount: string;

  @Prop({ type: String })
  correspondentAccount: string;

  @Prop({ type: String, enum: TaxSystem, default: TaxSystem.GENERAL })
  taxSystem: TaxSystem;

  @Prop({ type: String })
  contract: string;

  @Prop({ type: String })
  certificateOfRegistration: string;

  @Prop({ type: String })
  passportScan: string;

  @Prop({ type: String })
  leaseAgreement: string;

  @Prop({ type: String })
  insidePhoto: string;

  @Prop({ type: String })
  outsidePhoto: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  mainShop?: Shop;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }])
  branches: Shop[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
