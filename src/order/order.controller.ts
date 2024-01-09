import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, TimeSort } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('shopper/:id')
  findByShopperId(@Param('id') id: string) {
    return this.orderService.findByShopperId(id);
  }

  @Get('shop/:id')
  findByShopId(
    @Param('id') id: string, 
    @Query('status') status: OrderStatus,
    @Query('sort') sort: TimeSort
  ) {
    return this.orderService.findByShopId(id, status, sort);
  }

  @Get('courier/:id')
  findByCourierId(@Param('id') id: string) {
    return this.orderService.findByCourierId(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
