import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { Shop, ShopSchema } from '../shop/entities/shop.entity';
import { Category, CategorySchema } from '../category/entities/category.entity';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/entities/user.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
    CommonModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, UserService],
  exports: [ProductModule, ProductService],
})
export class ProductModule {}
