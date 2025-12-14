import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DocType } from '@prisma/client';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  fundId: string;

  @IsEnum(DocType)
  @IsNotEmpty()
  type: DocType;

  @IsString()
  @IsNotEmpty()
  periodStart: string;

  @IsString()
  @IsNotEmpty()
  periodEnd: string;

  @IsOptional()
  @IsString()
  description?: string;
}
