import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { CommonModule } from '../common/common.module';
import { Feedback, FeedbackSchema } from './entities/feedback.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CommonModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, ProductService, UserService],
})
export class FeedbackModule {}
