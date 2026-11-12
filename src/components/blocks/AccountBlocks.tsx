'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, MapPin, Package, RefreshCw, Trash2, User } from 'lucide-react';
import { CmsText, useCustomerAccount, useMoney, type CmsBlockProps } from '@latinovation/cms-client/react';

function AccountNav({ active }: { active: 'profile' | 'orders' | 'addresses' }) {
  return (
    <nav className="am-account-tabs" aria-label="Secciones de mi cuenta">
      <Link href="/cuenta" className={`am-filter-pill ${active === 'profile' ? 'is-active' : ''}`}>
        <User size={15} /> Mi perfil
      </Link>
      <Link href="/cuenta/pedidos" className={`am-filter-pill ${active === 'orders' ? 'is-active' : ''}`}>
        <Package size={15} /> Mis pedidos
      </Link>
      <Link href="/cuenta/direcciones" className={`am-filter-pill ${active === 'addresses' ? 'is-active' : ''}`}>
        <MapPin size={15} /> Mis direcciones
      </Link>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. ACCESO, REGISTRO Y PERFIL (/cuenta)                                     */
/* -------------------------------------------------------------------------- */

export function AccountAccessSection(_props: CmsBlockProps) {
  const acc = useCustomerAccount();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptsTerms, setAcceptsTerms] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await acc.login({ email: email.trim(), password });
    } catch (ex: any) {
      setErr(ex?.message || 'Credenciales incorrectas.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptsTerms) {
      setErr('Debes aceptar la política de privacidad y términos para crear tu cuenta.');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await acc.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        acceptsTerms: true,
      });
      if (r.claimedOrders?.length) {
        setMsg(`Cuenta creada. Vinculamos ${r.claimedOrders.length} pedido(s) previos a tu correo.`);
      }
    } catch (ex: any) {
      setErr(ex?.message || 'No fue posible crear la cuenta.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const resetUrl = typeof window !== 'undefined' ? `${window.location.origin}/cuenta/restablecer` : undefined;
      await acc.forgotPassword(email.trim(), resetUrl);
      setMsg('Si tu correo está registrado, te enviamos un enlace seguro para restablecer tu contraseña.');
    } catch (ex: any) {
      setErr(ex?.message || 'Ocurrió un inconveniente al enviar el enlace.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        <CmsText f="heading" as="h1" className="am-h1-page" />
        <CmsText f="intro" as="p" className="am-lead" />

        {acc.signedIn && acc.customer ? (
          <div className="am-account-panel">
            <AccountNav active="profile" />
            <div className="am-profile-card">
              <div className="am-profile-head">
                <div>
                  <h2>Hola, {acc.customer.name || acc.customer.email}</h2>
                  <p>{acc.customer.email}</p>
                  {acc.customer.phone ? <p>{acc.customer.phone}</p> : null}
                </div>
                <button type="button" onClick={acc.logout} className="am-btn am-btn-outline am-btn-sm">
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
              {msg ? <p className="am-coupon-feedback">{msg}</p> : null}

              <div className="am-profile-shortcuts">
                <Link href="/cuenta/pedidos" className="am-btn am-btn-primary">
                  Ver mis pedidos
                </Link>
                <Link href="/cuenta/direcciones" className="am-btn am-btn-outline">
                  Gestionar direcciones
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="am-auth-card">
            <div className="am-filter-pills" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'login'}
                onClick={() => {
                  setTab('login');
                  setErr(null);
                  setMsg(null);
                }}
                className={`am-filter-pill ${tab === 'login' ? 'is-active' : ''}`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'register'}
                onClick={() => {
                  setTab('register');
                  setErr(null);
                  setMsg(null);
                }}
                className={`am-filter-pill ${tab === 'register' ? 'is-active' : ''}`}
              >
                Crear cuenta
              </button>
            </div>

            {err ? <p className="am-field-err">{err}</p> : null}
            {msg ? <p className="am-coupon-feedback">{msg}</p> : null}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="am-lead-form">
                <label className="am-field">
                  <span>Correo electrónico</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="am-input"
                  />
                </label>
                <label className="am-field">
                  <span>Contraseña</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="am-input"
                  />
                </label>
                <button type="submit" disabled={busy} className="am-btn am-btn-primary am-w-full">
                  {busy ? 'Ingresando...' : 'Entrar a mi cuenta'}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="am-text-btn"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </form>
            ) : tab === 'register' ? (
              <form onSubmit={handleRegister} className="am-lead-form">
                <label className="am-field">
                  <span>Nombre completo</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="am-input"
                  />
                </label>
                <label className="am-field">
                  <span>Correo electrónico</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="am-input"
                  />
                </label>
                <label className="am-field">
                  <span>Celular / WhatsApp</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="am-input"
                  />
                </label>
                <label className="am-field">
                  <span>Contraseña (mínimo 8 caracteres)</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="am-input"
                  />
                </label>
                <label className="am-checkbox-row">
                  <input
                    type="checkbox"
                    required
                    checked={acceptsTerms}
                    onChange={(e) => setAcceptsTerms(e.target.checked)}
                  />
                  <span>
                    Acepto la <Link href="/privacidad">política de privacidad y términos del servicio</Link>.
                  </span>
                </label>
                <button type="submit" disabled={busy} className="am-btn am-btn-primary am-w-full">
                  {busy ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgot} className="am-lead-form">
                <label className="am-field">
                  <span>Tu correo electrónico registrado</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="am-input"
                  />
                </label>
                <button type="submit" disabled={busy} className="am-btn am-btn-primary am-w-full">
                  {busy ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
                <button type="button" onClick={() => setTab('login')} className="am-text-btn">
                  Volver a iniciar sesión
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. HISTORIAL DE PEDIDOS (/cuenta/pedidos)                                  */
/* -------------------------------------------------------------------------- */

export function AccountOrdersSection(_props: CmsBlockProps) {
  const acc = useCustomerAccount({ load: ['orders'] });
  const money = useMoney();

  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        <CmsText f="heading" as="h1" className="am-h1-page" />
        <CmsText f="intro" as="p" className="am-lead" />

        {!acc.signedIn ? (
          <div className="am-empty-card">
            <p>Inicia sesión para consultar tus órdenes o usa el rastreador público con tu número de pedido.</p>
            <div className="am-order-actions">
              <Link href="/cuenta" className="am-btn am-btn-primary">
                Iniciar sesión
              </Link>
              <Link href="/rastreo" className="am-btn am-btn-outline">
                Rastrear sin cuenta
              </Link>
            </div>
          </div>
        ) : (
          <div className="am-account-panel">
            <AccountNav active="orders" />

            {acc.orders.loading ? (
              <p>Cargando tus pedidos...</p>
            ) : acc.orders.items.length === 0 ? (
              <div className="am-empty-card">
                <p>Aún no registras pedidos con esta cuenta.</p>
                <Link href="/tienda" className="am-btn am-btn-primary">
                  Explorar presentaciones
                </Link>
              </div>
            ) : (
              <ul className="am-orders-list">
                {acc.orders.items.map((ord) => (
                  <li key={ord.orderNumber} className="am-order-row-card">
                    <div className="am-order-row-head">
                      <div>
                        <strong className="am-tabular">{ord.orderNumber}</strong>
                        <span className="am-order-date">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('es-CO') : ''}
                        </span>
                      </div>
                      <strong className="am-tabular">{money(Number(ord.totalAmount || 0))}</strong>
                    </div>

                    <div className="am-order-row-meta">
                      <span>Estado: {ord.status}</span>
                      <span>Pago: {ord.paymentStatus}</span>
                    </div>

                    <div className="am-order-actions">
                      <Link href={`/rastreo?code=${encodeURIComponent(ord.orderNumber)}`} className="am-btn am-btn-outline am-btn-sm">
                        Rastrear envío
                      </Link>
                      {ord.paymentStatus === 'FAILED' || ord.paymentStatus === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => acc.retryPayment(ord.orderNumber)}
                          className="am-btn am-btn-primary am-btn-sm"
                        >
                          <RefreshCw size={14} /> Pagar en línea
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. MIS DIRECCIONES (/cuenta/direcciones)                                   */
/* -------------------------------------------------------------------------- */

export function AccountAddressesSection(_props: CmsBlockProps) {
  const acc = useCustomerAccount({ load: ['addresses'] });
  const [label, setLabel] = useState('Casa');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('Valle del Cauca');
  const [busy, setBusy] = useState(false);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !city.trim()) return;
    setBusy(true);
    try {
      await acc.addresses.add({
        label,
        address: address.trim(),
        city: city.trim(),
        department,
        country: 'CO',
        isDefault: acc.addresses.items.length === 0,
      });
      setAddress('');
      setCity('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        <CmsText f="heading" as="h1" className="am-h1-page" />
        <CmsText f="intro" as="p" className="am-lead" />

        {!acc.signedIn ? (
          <div className="am-empty-card">
            <p>Inicia sesión para guardar tus direcciones de entrega.</p>
            <Link href="/cuenta" className="am-btn am-btn-primary">
              Ir a mi cuenta
            </Link>
          </div>
        ) : (
          <div className="am-account-panel">
            <AccountNav active="addresses" />

            <ul className="am-address-list">
              {acc.addresses.items.map((a) => (
                <li key={a.id} className="am-order-row-card">
                  <div className="am-order-row-head">
                    <div>
                      <strong>{a.label || 'Dirección'}</strong>
                      <p>
                        {a.address} · {a.city}, {a.department}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => acc.addresses.remove(a.id)}
                      className="am-icon-btn"
                      aria-label="Eliminar dirección"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={onAdd} className="am-auth-card am-lead-form">
              <h2 className="am-h3">Agregar nueva dirección</h2>
              <div className="am-form-grid-2">
                <label className="am-field">
                  <span>Nombre (ej. Casa, Oficina)</span>
                  <input value={label} onChange={(e) => setLabel(e.target.value)} className="am-input" />
                </label>
                <label className="am-field">
                  <span>Departamento</span>
                  <input value={department} onChange={(e) => setDepartment(e.target.value)} className="am-input" />
                </label>
                <label className="am-field">
                  <span>Ciudad</span>
                  <input required value={city} onChange={(e) => setCity(e.target.value)} className="am-input" />
                </label>
                <label className="am-field">
                  <span>Dirección completa</span>
                  <input required value={address} onChange={(e) => setAddress(e.target.value)} className="am-input" />
                </label>
              </div>
              <button type="submit" disabled={busy} className="am-btn am-btn-primary">
                {busy ? 'Guardando...' : 'Guardar dirección'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. RESTABLECER CONTRASEÑA (/cuenta/restablecer)                            */
/* -------------------------------------------------------------------------- */

export function AccountResetSection(_props: CmsBlockProps) {
  const [token, setToken] = useState('');
  const acc = useCustomerAccount();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    setToken(sp.get('token') || '');
  }, []);

  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErr('Falta el enlace de seguridad. Solicita uno nuevo desde Mi cuenta.');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await acc.resetPassword(token, password);
      setDone(true);
    } catch (ex: any) {
      setErr(ex?.message || 'El enlace venció o no es válido.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        <CmsText f="heading" as="h1" className="am-h1-page" />
        <CmsText f="intro" as="p" className="am-lead" />

        <div className="am-auth-card">
          {done ? (
            <div className="am-form-success">
              <p>Tu contraseña se actualizó y ya tienes sesión iniciada.</p>
              <Link href="/cuenta" className="am-btn am-btn-primary">
                Ir a mi cuenta
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="am-lead-form">
              {err ? <p className="am-field-err">{err}</p> : null}
              <label className="am-field">
                <span>Nueva contraseña (mínimo 8 caracteres)</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="am-input"
                />
              </label>
              <button type="submit" disabled={busy} className="am-btn am-btn-primary am-w-full">
                {busy ? 'Actualizando...' : 'Guardar nueva contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
