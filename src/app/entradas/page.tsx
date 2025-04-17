'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useState } from 'react';

export default function Entradas() {
  const entradas = [
    { categoria: 'Salário', valor: 5000, mes: 'Março', tipo: 'Fixo' },
    { categoria: 'Freelance', valor: 1500, mes: 'Março', tipo: 'Variável' },
    { categoria: 'Investimentos', valor: 800, mes: 'Março', tipo: 'Variável' },
    { categoria: 'Aluguel', valor: 1200, mes: 'Março', tipo: 'Fixo' },
    { categoria: 'Outros', valor: 500, mes: 'Março', tipo: 'Variável' },
  ];

  const totalEntradas = entradas.reduce((acc, entrada) => acc + entrada.valor, 0);
  const entradasFixas = entradas.filter(e => e.tipo === 'Fixo').reduce((acc, entrada) => acc + entrada.valor, 0);
  const entradasVariaveis = entradas.filter(e => e.tipo === 'Variável').reduce((acc, entrada) => acc + entrada.valor, 0);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const filteredEntradas = entradas.filter(entrada => {
    const matchesSearch = search === '' || entrada.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === '' || entrada.categoria === filterCategory;
    const matchesMonth = filterMonth === '' || entrada.mes === filterMonth;
    return matchesSearch && matchesCategory && matchesMonth;
  });

  const dataPie = entradas.map(entrada => ({
    name: entrada.categoria,
    value: entrada.valor
  }));
  const uniqueCategories = Array.from(new Set(entradas.map(entrada => entrada.categoria)));
  const uniqueMonths = Array.from(new Set(entradas.map(entrada => entrada.mes)));

  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107'];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
          Minhas Entradas
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Pesquisar por categoria"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
          >
            <option value="">Todas as Categorias</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
          >
            <option value="">Todos os Meses</option>
            {uniqueMonths.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Resumo das Entradas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total de Entradas</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Entradas Fixas</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              R$ {entradasFixas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Entradas Variáveis</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              R$ {entradasVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Distribuição das Entradas</h2>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Entradas por Categoria</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entradas}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabela de Entradas */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Detalhamento das Entradas</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Categoria</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#4b5563' }}>Valor</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Mês</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {entradas.map((entrada, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{entrada.categoria}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                        R$ {entrada.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{entrada.mes}</td>
                    <td style={{ padding: '0.75rem' }}>{entrada.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
