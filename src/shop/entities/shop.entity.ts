import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type ShopDocument = HydratedDocument<Shop>;

export enum Status {
  PADDING = 'PADDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

@Schema()
export class Shop {
  @Prop({ type: String, required: true, unique: true })
  title: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
