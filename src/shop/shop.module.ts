import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './entities/shop.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CommonModule } from '../common/common.module';
import { Product, ProductSchema } from '../product/entities/product.entity'
import { ProductService } from '../product/product.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    CommonModule,
  ],
  controllers: [ShopController],
  providers: [ShopService, UserService, ProductService],
})
export class ShopModule {}
