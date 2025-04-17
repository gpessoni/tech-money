'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const navItems = [
    { name: 'Relatórios', path: '/relatorios' },
    { name: 'Investimentos', path: '/investimentos' },
    { name: 'Gastos', path: '/gastos' },
    { name: 'Entradas', path: '/entradas' },
  ];

  return (
    <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>💰 Tech Money</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0',
                    borderBottom: '2px solid',
                    borderColor: pathname === item.path ? '#3b82f6' : 'transparent',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: pathname === item.path ? '#111827' : '#6b7280',
                    textDecoration: 'none',
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

            {/* Botão de logout */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: 'transparent',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              <span>🚪</span>
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}