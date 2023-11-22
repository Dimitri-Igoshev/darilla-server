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
import { ProductSort } from './enum/product-sort.enum';
import { UserId } from '../decorators/user-id.decorator';

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
    @Query('slug') slug: string,
    @Query('status') status: ProductStatus,
    @Query('search') search: string,
    @Query('minprice') minprice: string,
    @Query('maxprice') maxprice: string,
    @Query('sort') sort: ProductSort,
    @Query('limit') limit: string,
  ) {
    return this.productService.findAll(
      shop,
      category,
      slug,
      status,
      search,
      minprice,
      maxprice,
      sort,
      limit,
    );
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

  @Patch('update/main-image')
  updateMainImage(@Body() body: { id: string; url: string }) {
    return this.productService.updateMainImage(body);
  }

  @Patch('update/favorites')
  updateFavorites(
    @Body() body: { userId: string, productId: string },
  ) {
    return this.productService.updateFavorites(body);
  }
}
