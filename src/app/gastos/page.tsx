'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useState } from 'react';

export default function Gastos() {
  const gastos = [
    { categoria: 'Moradia', valor: 2500, mes: 'Março', tipo: 'Fixos' },
    { categoria: 'Alimentação', valor: 1200, mes: 'Março', tipo: 'Variáveis' },
    { categoria: 'Transporte', valor: 800, mes: 'Março', tipo: 'Fixos' },
    { categoria: 'Lazer', valor: 500, mes: 'Março', tipo: 'Variáveis' },
    { categoria: 'Saúde', valor: 300, mes: 'Março', tipo: 'Fixos' },
    { categoria: 'Educação', valor: 400, mes: 'Março', tipo: 'Fixos' },
  ];

  const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.valor, 0);
  const gastosFixos = gastos.filter(g => g.tipo === 'Fixos').reduce((acc, gasto) => acc + gasto.valor, 0);
  const gastosVariaveis = gastos.filter(g => g.tipo === 'Variáveis').reduce((acc, gasto) => acc + gasto.valor, 0);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const filteredGastos = gastos.filter(gasto => {
    const matchesSearch = search === '' || gasto.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === '' || gasto.categoria === filterCategory;
    const matchesMonth = filterMonth === '' || gasto.mes === filterMonth;
    return matchesSearch && matchesCategory && matchesMonth;
  });


  const dataPie = gastos.map(gasto => ({
    name: gasto.categoria,
    value: gasto.valor
  }));
  const uniqueCategories = Array.from(new Set(gastos.map(gasto => gasto.categoria)));
  const uniqueMonths = Array.from(new Set(gastos.map(gasto => gasto.mes)));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
          Meus Gastos
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

        {/* Resumo dos Gastos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total de Gastos</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626' }}>
              R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Gastos Fixos</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626' }}>
              R$ {gastosFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Gastos Variáveis</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626' }}>
              R$ {gastosVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Resumo dos Gastos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total de Gastos</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626' }}>
              R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Gastos Fixos</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626' }}>
              R$ {gastosFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Gastos Variáveis</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626' }}>
              R$ {gastosVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Distribuição dos Gastos</h2>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Gastos por Categoria</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gastos}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#FF6B6B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabela de Gastos */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Detalhamento dos Gastos</h2>
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
                {gastos.map((gasto, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{gasto.categoria}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                      R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{gasto.mes}</td>
                    <td style={{ padding: '0.75rem' }}>{gasto.tipo}</td>
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
