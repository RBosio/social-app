import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  description?: string;
}
