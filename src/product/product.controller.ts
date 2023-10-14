import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(files, createProductDto);
  }

  @Get()
  findAll(
    @Query('shop') shop: string,
    @Query('category') category: string,
    @Query('status') status: ProductStatus,
    @Query('search') search: string,
    @Query('limit') limit: string,
  ) {
    return this.productService.findAll(shop, category, status, search, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, files, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Patch('main-image/:id')
  updateMainImage(@Param(':id') id: string, @Body() body: { url: string }) {
    return this.productService.updateMainImage(id, body.url);
  }
}
