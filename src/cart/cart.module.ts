import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { Shop, ShopSchema } from 'src/shop/entities/shop.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Cart, CartSchema } from './entities/cart.entity';
import { UserService } from 'src/user/user.service';
import { CommonModule } from 'src/common/common.module';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from 'src/category/category.service';
import { Category, CategorySchema } from 'src/category/entities/category.entity';
import { Feedback, FeedbackSchema } from 'src/feedback/entities/feedback.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CommonModule,
  ],
  controllers: [CartController],
  providers: [CartService, UserService, ProductService, CategoryService],
})
export class CartModule {}
