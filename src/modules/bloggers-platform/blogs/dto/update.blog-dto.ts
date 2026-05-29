import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from 'src/core/decorators/trim';

export class UpdateBlogDto {
  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  name: string;

  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @IsEmail()
  websiteUrl: string;
}
