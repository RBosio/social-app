import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  userId: number;
}
