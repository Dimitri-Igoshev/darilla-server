import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CommonModule } from '../common/common.module';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Shop, ShopSchema } from '../shop/entities/shop.entity';
import { Category, CategorySchema } from '../category/entities/category.entity'
import { CategoryService } from '../category/category.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService, ProductService, CategoryService],
})
export class UserModule {}
