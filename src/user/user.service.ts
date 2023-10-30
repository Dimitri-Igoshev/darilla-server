import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { FileService } from '../file/file.service';
import { MFile } from '../file/mfile.class';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly fileService: FileService,
  ) {}

  saltOrRounds = 12;

  async createUser(user: CreateUserDto, file: MFile) {
    const isExist = await this.getUserByEmail(user.email);

    if (isExist)
      throw new HttpException('User is already exists', HttpStatus.CONFLICT);

    const newUser = new this.userModel({
      ...user,
      password: user.password
        ? await bcrypt.hash(user.password, this.saltOrRounds)
        : await bcrypt.hash('111111', this.saltOrRounds),
    });

    const savedUser = await newUser.save();

    if (!file) return savedUser;

    const res = await this.fileService.saveFile([file]);

    if (res && res[0]?.url) {
      return this.userModel.findOneAndUpdate(
        { _id: savedUser._id },
        { photo: res[0].url },
        { new: true },
      );
    } else {
      return savedUser;
    }
  }

  async getUsers({ role, search, limit }) {
    const filter: any = {};
    if (role) filter.roles = role;

    let res = [];

    await this.userModel
      .find(filter)
      .or([
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ])
      .select('-password')
      .limit(limit)
      .exec()
      .then((data) => (res = [...data]));

    if (role === Role.USER) {
      return res.filter(
        (i: User) =>
          !i.roles.includes(Role.MODERATOR) &&
          !i.roles.includes(Role.SELLER) &&
          !i.roles.includes(Role.SUPPORT) &&
          !i.roles.includes(Role.SALES_PERSON) &&
          !i.roles.includes(Role.CONTENT_MANAGER) &&
          !i.roles.includes(Role.ADMIN) &&
          !i.roles.includes(Role.COURIER),
      );
    } else {
      return res;
    }
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

  async updateUser(id: string, user: UpdateUserDto, file: MFile) {
    if (file) {
      const res = await this.fileService.saveFile([file]);
      if (res && res[0]?.url) user.photo = res[0].url;
    }

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

  getShopStaff(shopId: string) {
    return this.userModel.find({ shops: shopId }).select('-password').exec();
  }
}
