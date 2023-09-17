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
  @Prop({ type: String, required: true, unique: true })
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
  weekendStart: string;

  @Prop({ type: String })
  weekendEnd: string;

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

  @Prop({ type: String, enum: TaxSystem, default: TaxSystem.GENERAL })
  taxSystem: TaxSystem;

  @Prop({ type: String })
  contract: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
