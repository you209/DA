import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventName, eventPayload } = body as { eventName: string; eventPayload?: Record<string, unknown> };
  if (!eventName) return NextResponse.json({ error: 'eventName required' }, { status: 400 });
  return NextResponse.json({ ok: true, accepted: { eventName, eventPayload: eventPayload || {} } });
}
