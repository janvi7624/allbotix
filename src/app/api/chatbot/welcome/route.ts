import { welcome } from '@/lib/chatbot';

export async function GET() {
  return Response.json(welcome());
}
