import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Category {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  parent: Category;

  @Prop({ type: String })
  parentName: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
  children: Category[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
