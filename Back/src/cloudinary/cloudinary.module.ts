import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { PrismaService } from 'src/modules/database/prisma.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, PrismaService]
})
export class CloudinaryModule {}
