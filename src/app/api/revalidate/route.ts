import crypto from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CMS_SLUG } from '@/lib/site';

function verifyHmacSignature(rawBody: string, headerValue: string | null, secret: string): boolean {
  if (!headerValue || !secret) return false;
  const parts = Object.fromEntries(
    headerValue.split(',').map((part) => {
      const idx = part.indexOf('=');
      return idx > 0 ? [part.slice(0, idx).trim(), part.slice(idx + 1).trim()] : ['', ''];
    }),
  );
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${ts}.${rawBody}`).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const secret = process.env.CMS_WEBHOOK_SECRET || '';
  if (!secret) {
    return Response.json({ ok: false, error: 'Webhook secret not configured' }, { status: 401 });
  }

  const rawBody = await req.text();
  const directHeader = req.headers.get('x-cms-webhook-secret');
  const hmacHeader = req.headers.get('x-webproai-signature');

  const authorized = directHeader === secret || verifyHmacSignature(rawBody, hmacHeader, secret);
  if (!authorized) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let body: { projectSlug?: string } = {};
  try {
    body = JSON.parse(rawBody || '{}');
  } catch {
    body = {};
  }

  revalidateTag(`cms:${body.projectSlug || CMS_SLUG}`);
  revalidatePath('/', 'layout');
  return Response.json({ ok: true, revalidated: true });
}
