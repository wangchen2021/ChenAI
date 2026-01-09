import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { type Request, type Response } from 'express';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { HttpUtil } from 'src/common/utils/http/HttpUtil';
import { GetTextReqDto } from './dto/get-text-req.dto';

@ApiTags('openAI')
@Controller('openAI')
export class OpenAiController {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly httpUtil: HttpUtil,
  ) {}

  @Get()
  pinApi(@Req() req: Request) {
    return 'success';
  }

  @Get('error')
  errorApi() {
    throw new Error('api test error');
  }

  @ApiHeader({
    name: '获取AI文本回复',
    description: '输入文本，获取AI文本stream流回复',
  })
  @ApiBody({
    type: GetTextReqDto,
    description: '用户输入文本',
  })
  @Post('getTextRes')
  async getAIStreamRes(@Body() body: GetTextReqDto, @Res() res: Response) {
    const { text } = body;
    this.httpUtil.openCustomSSE(res);
    const stream = await this.openAiService.getOpenAIStreamRes(text);
    for await (const part of stream) {
      const msg = part.choices[0]?.delta?.content || '';
      res.write(`data: ${JSON.stringify({ content: msg })}\n\n`);
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
}
