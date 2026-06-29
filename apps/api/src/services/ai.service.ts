
import axios from 'axios';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';

export interface GeneratedMetadata {
  title: string;
  description: string;
  hashtags: string[];
  category: string;
  language: string;
}

export class AIService {
  public async generateMetadata(fileName: string, context?: string): Promise<GeneratedMetadata> {
    const prompt = `Generate YouTube/Instagram metadata for a video named: "${fileName}". 
    Context: ${context || 'No context'}.
    Return ONLY a JSON object with keys: title (string), description (string), hashtags (array of strings), category (string), language (string).`;

    // 1. OpenRouter (Primary)
    if (env.OPENROUTER_API_KEY) {
      try {
        logger.info('Calling OpenRouter for AI metadata...');
        const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        }, {
          headers: {
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const content = (res.data as any).choices[0].message.content;
        return JSON.parse(content);
      } catch (error: any) {
        logger.error('OpenRouter failed, falling back to Ollama', error.message);
      }
    }

    // 2. Ollama (Fallback)
    try {
      logger.info('Calling Ollama for AI metadata...');
      const ollamaUrl = env.OLLAMA_URL || 'http://localhost:11434';
      const res = await axios.post(`${ollamaUrl}/api/generate`, {
        model: 'llama3',
        prompt: prompt,
        stream: false,
        format: 'json'
      });
      return JSON.parse((res.data as any).response);
    } catch (error: any) {
      logger.error('Ollama fallback failed.', error.message);
      throw new Error('AI Generation failed on all providers');
    }
  }
}
