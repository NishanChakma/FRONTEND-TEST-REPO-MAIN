import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
    private readonly uploadDir = './uploads';

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir);
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return fileName;  
    }

    async getFileStream(fileKey: string): Promise<fs.ReadStream> {
        const filePath = path.join(this.uploadDir, fileKey);
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        return fs.createReadStream(filePath);
    }
}
