import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './entities/shop.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CommonModule } from '../common/common.module';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Feedback, FeedbackSchema } from '../feedback/entities/feedback.entity';
import { CategoryService } from '../category/category.service'
import { Category, CategorySchema } from '../category/entities/category.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CommonModule,
  ],
  controllers: [ShopController],
  providers: [ShopService, UserService, ProductService, CategoryService],
})
export class ShopModule {}
