import { IsNotEmpty, IsOptional, IsString, IsUppercase } from 'class-validator';

export class CreateFundDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
