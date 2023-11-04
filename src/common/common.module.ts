import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [FileModule],
  providers: [FileService],
  exports: [FileModule, FileService],
})
export class CommonModule {}
