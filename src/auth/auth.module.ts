import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CommonModule } from '../common/common.module';
import { ProductService } from '../product/product.service';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { Category, CategorySchema } from '../category/entities/category.entity'
import { CategoryService } from '../category/category.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ProductService, CategoryService],
})
export class AuthModule {}
