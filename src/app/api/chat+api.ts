import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemPrompt = process.env.SYSTEM_PROMPT;
  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
