'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@latinovation/cms-client/react';

function RecoverInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCart();
  const [status, setStatus] = useState<'loading' | 'done' | 'empty'>('loading');

  useEffect(() => {
    const token = searchParams.get('token') || '';
    if (!token) {
      setStatus('empty');
      return;
    }
    const c = (cart as any).cart;
    if (c && typeof c.recover === 'function') {
      c.recover(token)
        .then(() => {
          setStatus('done');
          router.replace('/checkout');
        })
        .catch(() => setStatus('empty'));
    } else {
      router.replace('/checkout');
    }
  }, [cart, router, searchParams]);

  return (
    <div className="am-section-pad am-container am-narrow-container">
      <div className="am-order-status-card">
        <h1 className="am-h2">
          {status === 'loading' ? 'Restaurando tu bolsa mineral...' : 'No encontramos una bolsa pendiente'}
        </h1>
        {status === 'empty' ? (
          <div>
            <p className="am-lead">Puedes elegir nuevamente tu presentación desde la tienda.</p>
            <div className="am-mt-lg">
              <Link href="/tienda" className="am-btn am-btn-primary">
                Ir a la tienda
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CartRecoverPage() {
  return (
    <Suspense fallback={<div className="am-section-pad am-container">Restaurando tu bolsa...</div>}>
      <RecoverInner />
    </Suspense>
  );
}
