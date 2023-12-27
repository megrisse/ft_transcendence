import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class FileService {
  readFile(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
  }
}