import { IsOptional } from "class-validator";

export class UpdatePostDto {
  @IsOptional()
  description?: string;
}
