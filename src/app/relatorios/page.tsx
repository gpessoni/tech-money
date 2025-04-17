'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Home() {
  const dadosGrafico = [
    { name: 'Receitas', value: 7000 },
    { name: 'Despesas', value: 2000 },
  ];

  const dadosMensais = [
    { mes: 'Jan', receitas: 5000, despesas: 3000 },
    { mes: 'Fev', receitas: 6000, despesas: 3500 },
    { mes: 'Mar', receitas: 7000, despesas: 2000 },
  ];

  const COLORS = ['#059669', '#dc2626'];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
          Controle Financeiro Pessoal
        </h1>
        
        {/* Resumo Financeiro */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Saldo Total</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>R$ 5.000,00</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Receitas</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>R$ 7.000,00</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Despesas</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>R$ 2.000,00</p>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {/* Gráfico de Pizza */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Distribuição Financeira</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosGrafico}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Evolução Mensal</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosMensais}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="receitas" fill="#059669" />
                  <Bar dataKey="despesas" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
          
        {/* Lista de Transações */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Últimas Transações</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
              <div>
                <p style={{ fontWeight: '500' }}>Salário</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>15/03/2024</p>
              </div>
              <p style={{ color: '#059669', fontWeight: '600' }}>+ R$ 3.000,00</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
              <div>
                <p style={{ fontWeight: '500' }}>Aluguel</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>10/03/2024</p>
              </div>
              <p style={{ color: '#dc2626', fontWeight: '600' }}>- R$ 1.200,00</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
              <div>
                <p style={{ fontWeight: '500' }}>Supermercado</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>08/03/2024</p>
              </div>
              <p style={{ color: '#dc2626', fontWeight: '600' }}>- R$ 800,00</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}