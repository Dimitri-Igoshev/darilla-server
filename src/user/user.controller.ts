import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@UserId() id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createUser(createUserDto, file);
  }

  @Get()
  getUsers(
    @Query('role') role: string,
    @Query('search') search: string,
    @Query('limit') limit: number,
  ) {
    return this.userService.getUsers({ role, search, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('staff/:shopId')
  findShopStaff(@Param('shopId') shopId: string) {
    return this.userService.getShopStaff(shopId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser(id, updateUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }

  @Patch('update/favorites')
  updateFavorites(@Body() data: { productId: string; userId: string }) {
    return this.userService.updateFavorites(data);
  }
}
