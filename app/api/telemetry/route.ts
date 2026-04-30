import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventName, eventPayload, sessionId } = body as {
    eventName: string;
    eventPayload?: Record<string, unknown>;
    sessionId?: string;
  };
  if (!eventName) return NextResponse.json({ error: 'eventName required' }, { status: 400 });

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  let userId: string | null = null;
  if (token) {
    const { data } = await supabaseServer.auth.getUser(token);
    userId = data.user?.id ?? null;
  }

  const { error } = await supabaseServer.from('telemetry_events').insert({
    user_id: userId,
    session_id: sessionId || null,
    event_name: eventName,
    event_payload: eventPayload || {}
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
