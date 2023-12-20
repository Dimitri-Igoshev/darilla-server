import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema},
      // { name: Shop.name, schema: ShopSchema },
      // { name: User.name, schema: UserSchema },
      // { name: Product.name, schema: ProductSchema },
      // { name: Feedback.name, schema: FeedbackSchema },
      // { name: Category.name, schema: CategorySchema },
    ]),
    // CommonModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
