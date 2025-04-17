'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = isLogin ? `${process.env.NEXT_PUBLIC_API_URL}/users/auth` : `${process.env.NEXT_PUBLIC_API_URL}/users`;
      const body = isLogin ? { email: formData.email, password: formData.password } : formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar a requisição');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        router.push('/relatorios');
      } else {
        setIsLogin(true);
        setFormData({ email: '', name: '', password: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <main style={{ 
      padding: '4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '28rem', 
        width: '100%',
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '2.5rem', 
          textAlign: 'center' 
        }}>
          💰 Tech Money
        </h1>

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: 'white', 
          padding: '2.5rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{ 
              color: '#dc2626', 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              borderRadius: '0.5rem'
            }}>
              {error}
            </div>
          )}

          {!isLogin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem', 
                color: '#4b5563',
                fontWeight: '500'
              }}>Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                }}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              color: '#4b5563',
              fontWeight: '500'
            }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              color: '#4b5563',
              fontWeight: '500'
            }}>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
            }}
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'transparent',
              color: '#2563eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '1px solid #2563eb',
              fontSize: '1rem',
              transition: 'all 0.2s',
              marginBottom: '1.5rem',
            }}
          >
            {isLogin ? 'Criar uma conta' : 'Já tenho uma conta'}
          </button>

         
         <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', cursor: 'pointer' }} onClick={() => router.push('/termos')}>
            Termos de Uso
         </p>
        </form>
      </div>
    </main>
  );
}
