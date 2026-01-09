import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
export class GetTextReqDto {
  @ApiProperty({
    description: '用户输入文本',
    type: 'string',
    required: true,
    example: '你好',
  })
  @IsString()
  @MinLength(2, { message: '用户名长度不能小于 2' })
  text: string;
}
