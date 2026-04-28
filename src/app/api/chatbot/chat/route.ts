import { reply, HistoryMessage } from '@/lib/chatbot';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = typeof body?.message === 'string' ? body.message : '';
  const history: HistoryMessage[] = Array.isArray(body?.history) ? body.history : [];
  return Response.json(await reply(message, history));
}
