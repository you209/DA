import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

async function getRoleFromBearer(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return { userId: null, role: null };

  const { data: userData } = await supabaseServer.auth.getUser(token);
  const userId = userData.user?.id ?? null;
  if (!userId) return { userId: null, role: null };

  const { data: roleRow } = await supabaseServer.from('admin_roles').select('role').eq('user_id', userId).single();
  return { userId, role: roleRow?.role ?? null };
}

export async function POST(req: NextRequest) {
  const { userId, role } = await getRoleFromBearer(req);
  if (!userId || !role || !['editor','verifier','admin'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { serviceId, stage } = body as { serviceId: string; stage: 'draft' | 'review' | 'published' };
  if (!serviceId || !stage) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data: existing } = await supabaseServer.from('services').select('publish_stage').eq('id', serviceId).single();
  const fromStage = existing?.publish_stage ?? 'draft';

  const { error: updateErr } = await supabaseServer.from('services').update({ publish_stage: stage }).eq('id', serviceId);
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await supabaseServer.from('audit_logs').insert({
    actor_id: userId,
    actor_role: role,
    service_id: serviceId,
    action: 'publish_stage_change',
    from_value: fromStage,
    to_value: stage
  });

  return NextResponse.json({ ok: true, serviceId, fromStage, toStage: stage, actorRole: role });
}
