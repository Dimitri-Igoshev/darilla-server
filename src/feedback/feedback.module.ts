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
import { Shop, ShopSchema } from '../shop/entities/shop.entity';
import { ShopService } from '../shop/shop.service';
import { Category, CategorySchema } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CommonModule,
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    ProductService,
    UserService,
    ShopService,
    CategoryService,
  ],
})
export class FeedbackModule {}
