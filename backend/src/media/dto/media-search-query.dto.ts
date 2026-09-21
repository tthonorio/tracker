import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MediaSearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  q: string;
}
