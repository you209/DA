import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceId, stage, actorRole } = body as { serviceId: string; stage: string; actorRole: string };
  if (!serviceId || !stage) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // Placeholder endpoint for server-side enforcement once service role tokens are wired.
  return NextResponse.json({ ok: true, serviceId, stage, actorRole, mode: 'stubbed-server-policy' });
}
