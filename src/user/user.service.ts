import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  saltOrRounds = 12;

  async createUser(user: CreateUserDto) {
    const isExist = await this.getUserByEmail(user.email);

    if (isExist)
      throw new HttpException('User is already exists', HttpStatus.CONFLICT);

    const newUser = new this.userModel({
      ...user,
      password: await bcrypt.hash(user.password, this.saltOrRounds),
    });

    return newUser.save();
  }

  getUsers({ role, search, page, quantity }) {
    const filter: any = {};
    if (role) filter.roles = role;
    if (search) {
      filter.firstName = { $regex: search, $options: 'i' };
      filter.lastName = { $regex: search, $options: 'i' };
      filter.email = { $regex: search, $options: 'i' };
    }
    const num: number = quantity || 15;
    const skip: number = page === 1 ? 0 : (page - 1) * num;

    return this.userModel
      .find(filter)
      .select('-password')
      .skip(skip)
      .limit(num);
  }

  getUserById(id: string) {
    return this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({ path: 'shops', model: 'Shop' })
      .exec();
  }

  getUserByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  updateUser(id: string, user: UpdateUserDto) {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { ...user }, { new: true })
      .select('-password')
      .exec();
  }

  removeUser(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  async addShop(id: string, shop: string) {
    const user = await this.getUserById(id);

    return user
      .updateOne(
        { shops: [...user.shops, shop], roles: [...user.roles, Role.SELLER] },
        { new: true },
      )
      .exec();
  }
}
