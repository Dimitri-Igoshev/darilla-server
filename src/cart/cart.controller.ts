import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PaymentDto } from './dto/payment.dto';
import { CaptureDto } from './dto/capture.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOneByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Post('pay')
  pay(@Body() paymentDto: PaymentDto) {
    return this.cartService.createPayment(paymentDto);
  }

  @Post('capture')
  capture(@Body() captureDto: CaptureDto) {
    return this.cartService.capturePayment(captureDto)
  }
}
