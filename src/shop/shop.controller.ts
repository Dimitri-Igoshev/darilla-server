import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  createShop(@Body() createShopDto: CreateShopDto) {
    return this.shopService.createShop(createShopDto);
  }

  @Patch(':id')
  updateShop(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.updateShop(id, updateShopDto);
  }

  @Get()
  getShops() {
    return this.shopService.getShops();
  }

  @Get(':id')
  getShop(@Param('id') id: string) {
    return this.shopService.getShopById(id);
  }
}
