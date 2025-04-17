'use client';

import Navbar from "@/components/Navbar";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Investimentos() {
  const investimentos = [
    { nome: 'Tesouro Direto', valor: 15000, rendimento: 8.5, categoria: 'Renda Fixa' },
    { nome: 'CDB', valor: 10000, rendimento: 7.2, categoria: 'Renda Fixa' },
    { nome: 'Ações PETR4', valor: 8000, rendimento: 12.5, categoria: 'Renda Variável' },
    { nome: 'Fundo Imobiliário', valor: 20000, rendimento: 9.8, categoria: 'Renda Variável' },
  ];

  const totalInvestido = investimentos.reduce((acc, inv) => acc + inv.valor, 0);
  const rendimentoTotal = investimentos.reduce((acc, inv) => acc + (inv.valor * inv.rendimento / 100), 0);

  const dataPie = investimentos.map(inv => ({
    name: inv.nome,
    value: inv.valor
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
            Meus Investimentos
          </h1>

          {/* Resumo dos Investimentos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total Investido</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Rendimento Anual</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                R$ {rendimentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Gráficos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Distribuição dos Investimentos</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataPie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Rendimento por Investimento</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={investimentos}>
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rendimento" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela de Investimentos */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Detalhamento dos Investimentos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Investimento</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem', color: '#4b5563' }}>Valor</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem', color: '#4b5563' }}>Rendimento</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {investimentos.map((inv, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>{inv.nome}</td>
                      <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                        R$ {inv.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem' }}>{inv.rendimento}%</td>
                      <td style={{ padding: '0.75rem' }}>{inv.categoria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
