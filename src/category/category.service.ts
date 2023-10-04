import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly fileService: FileService,
  ) {}

  async create(file: Express.Multer.File, data: CreateCategoryDto) {
    const newCategory = new this.categoryModel(data);
    const res = await newCategory.save();

    if (data.parent) {
      const parent = await this.categoryModel
        .findOne({ _id: data.parent })
        .exec();

      await parent
        .updateOne({ children: [...parent.children, res._id] }, { new: true })
        .exec();
    }

    if (file) {
      const media = await this.fileService.saveFile([file]);

      if (media[0].url) {
        return this.categoryModel
          .findOneAndUpdate(
            { _id: res._id },
            { imageUrl: media[0].url },
            { new: true },
          )
          .exec();
      }
    }

    return res;
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(id: string) {
    return this.categoryModel.findOne({ _id: id }).exec();
  }

  findRootCategories() {
    return this.categoryModel.find({ parent: { $exists: false } }).exec();
  }

  findChildren(parentId: string) {
    return this.categoryModel.find({ parent: parentId }).exec();
  }

  async update(id: string, file: Express.Multer.File, data: UpdateCategoryDto) {
    const res = this.categoryModel
      .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .exec();

    if (file) {
      const media = await this.fileService.saveFile([file]);

      if (media[0].url) {
        return this.categoryModel
          .findOneAndUpdate(
            { _id: id },
            { imageUrl: media[0].url },
            { new: true },
          )
          .exec();
      }
    }

    return res;
  }

  async remove(id: string) {
    return this.categoryModel.deleteOne({ _id: id }).exec();
  }
}
