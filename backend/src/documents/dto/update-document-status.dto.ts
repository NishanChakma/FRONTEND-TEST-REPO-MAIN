import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocStatus } from '@prisma/client';

export class UpdateDocumentStatusDto {
  @IsEnum(DocStatus)
  @IsNotEmpty()
  status: DocStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
