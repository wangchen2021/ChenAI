import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "781ffd2a-1d82-46d7-96cf-f0709a6ccf9d",
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
})

@Injectable()
export class OpenAiService {

    async getOpenAIRes(text: string) {
        return await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: text,
                }
            ],
            model: 'doubao-seed-1-6-251015',
            reasoning_effort: "medium",
        });
    }

    async getOpenAIStreamRes(text: string) {
        return await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: text,
                }
            ],
            model: 'doubao-seed-1-6-251015',
            reasoning_effort: "medium",
            stream: true
        });
    }
}
