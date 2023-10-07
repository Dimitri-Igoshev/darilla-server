import { Injectable } from '@nestjs/common';
import { FileResponseEl } from './dto/file-response-el';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';
// import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  getFileName(file: MFile): string {
    const fileStrArr = file.originalname.split('.');
    const fileType = fileStrArr[fileStrArr.length - 1];
    return `${Date.now()}-${Math.floor(Math.random() * 100)}.${fileType}`;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async saveFile(files: MFile[]): Promise<FileResponseEl[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);

    const res: FileResponseEl[] = [];

    for (const file of files) {
      file.originalname = this.getFileName(file);

      let resizedFiles = [];

      if (file.mimetype.includes('image')) {
        const buffer = await this.convertToWebP(file.buffer);

        resizedFiles = [
          {
            originalname: `${file.originalname.split('.')[0]}-xl.webp`,
            buffer: await sharp(buffer).resize(600, 600).toBuffer(),
          },
          {
            originalname: `${file.originalname.split('.')[0]}-l.webp`,
            buffer: await sharp(buffer).resize(400, 400).toBuffer(),
          },
          {
            originalname: `${file.originalname.split('.')[0]}-m.webp`,
            buffer: await sharp(buffer).resize(200, 200).toBuffer(),
          },
          {
            originalname: `${file.originalname.split('.')[0]}-s.webp`,
            buffer: await sharp(buffer).resize(100, 100).toBuffer(),
          },
          {
            originalname: `${file.originalname.split('.')[0]}-xs.webp`,
            buffer: await sharp(buffer).resize(50, 50).toBuffer(),
          },
        ];

        // file.originalname = `${file.originalname.split('.')[0]}.webp`;
        // file.buffer = buffer;
      }

      resizedFiles.forEach((el: MFile) => {
        writeFile(`${uploadFolder}/${el.originalname}`, el.buffer);
        res.push({
          url: `${dateFolder}/${el.originalname}`,
          name: el.originalname,
        });
      });

      // await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      // res.push({
      //   url: `${dateFolder}/${file.originalname}`,
      //   name: file.originalname,
      // });
    }

    return res;
  }
}

// await this.resizeFile(buffer);
