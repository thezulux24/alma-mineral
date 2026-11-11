'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StoreUiValue {
  cartOpen: boolean;
  openCart(): void;
  closeCart(): void;
  toggleCart(): void;
  toast: string | null;
  notify(msg: string): void;
  bagPulse: number;
  triggerBagPulse(): void;
}

const StoreUiContext = createContext<StoreUiValue | null>(null);

export function StoreUiProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [bagPulse, setBagPulse] = useState(0);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen((v) => !v), []);
  const triggerBagPulse = useCallback(() => setBagPulse((n) => n + 1), []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen]);

  const value = useMemo<StoreUiValue>(
    () => ({ cartOpen, openCart, closeCart, toggleCart, toast, notify, bagPulse, triggerBagPulse }),
    [cartOpen, openCart, closeCart, toggleCart, toast, notify, bagPulse, triggerBagPulse],
  );

  return <StoreUiContext.Provider value={value}>{children}</StoreUiContext.Provider>;
}

export function useStoreUi(): StoreUiValue {
  const ctx = useContext(StoreUiContext);
  if (!ctx) throw new Error('useStoreUi debe usarse dentro de <StoreUiProvider>');
  return ctx;
}
