import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewBranchDto } from './dto/create-new-branch.dto'

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  createShop(@Body() createShopDto: CreateShopDto) {
    return this.shopService.createShop(createShopDto);
  }

  @Post('new-branch')
  createNewBranch(@Body() createNewBranch: CreateNewBranchDto) {
    return this.shopService.createNewBranch(createNewBranch);
  }

  @Post('upload-logo/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.shopService.uploadLogo(id, file);
  }

  @Post('upload-doc/:id/:doc')
  @UseInterceptors(FileInterceptor('doc'))
  async uploadDoc(
    @Param('id') id: string,
    @Param('doc') doc: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.shopService.uploadDoc(id, doc, file);
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
