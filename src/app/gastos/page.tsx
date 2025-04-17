'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";

enum CategoriaGasto {
  ALIMENTACAO = 'ALIMENTACAO',
  TRANSPORTE = 'TRANSPORTE', 
  SAUDE = 'SAUDE',
  EDUCACAO = 'EDUCACAO',
  MORADIA = 'MORADIA',
  LAZER = 'LAZER',
  VESTUARIO = 'VESTUARIO',
  SERVICOS = 'SERVICOS',
  IMPOSTOS = 'IMPOSTOS',
  SEGUROS = 'SEGUROS',
  PRESENTES = 'PRESENTES',
  VIAGENS = 'VIAGENS',
  OUTROS = 'OUTROS'
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  userId: string;
}

interface EditForm {
  description: string;
  amount: number;
  category: string;
}

interface CreateForm {
  description: string;
  amount: number;
  category: string;
}

const getCategoriaTraduzida = (categoria: string): string => {
  return categoria;
};

export default function Gastos() {
  const [gastos, setGastos] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedGasto, setSelectedGasto] = useState<Expense | null>(null);
  const [gastoToDelete, setGastoToDelete] = useState<Expense | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    description: '',
    amount: 0,
    category: ''
  });

  const [newGasto, setNewGasto] = useState<CreateForm>({
    description: '',
    amount: 0,
    category: ''
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar gastos');
        }

        const data = await response.json();
        setGastos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    if (selectedGasto) {
      setEditForm({
        description: selectedGasto.description,
        amount: selectedGasto.amount,
        category: selectedGasto.category
      });
    }
  }, [selectedGasto]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGasto)
      });

      if (!response.ok) throw new Error('Falha ao criar gasto');

      const createdGasto = await response.json();
      setGastos([...gastos, createdGasto]);
      setNewGasto({
        description: '',
        amount: 0,
        category: ''
      });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGasto) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${selectedGasto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Falha ao atualizar gasto');

      const updatedGasto = await response.json();
      setGastos(gastos.map(gasto =>
        gasto.id === updatedGasto.id ? updatedGasto : gasto
      ));
      setSelectedGasto(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  const handleDelete = async () => {
    if (!gastoToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${gastoToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Falha ao excluir gasto');

      setGastos(gastos.filter(gasto => gasto.id !== gastoToDelete.id));
      setGastoToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  const filteredGastos = gastos.filter(gasto => {
    const matchesSearch = search === '' || gasto.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === '' || gasto.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalGastos = filteredGastos.reduce((acc, gasto) => acc + gasto.amount, 0);
  
  // Cálculo da média mensal
  const mediaGastos = totalGastos / (filteredGastos.length || 1);
  
  // Encontrar maior gasto
  const maiorGasto = filteredGastos.reduce((max, gasto) => 
    gasto.amount > max.amount ? gasto : max, 
    { amount: 0 } as Expense
  );

  // Encontrar menor gasto
  const menorGasto = filteredGastos.reduce((min, gasto) => 
    (gasto.amount < min.amount || min.amount === 0) ? gasto : min,
    { amount: 0 } as Expense
  );

  const gastosPorCategoria = filteredGastos.reduce((acc, gasto) => {
    const categoria = getCategoriaTraduzida(gasto.category);
    if (!acc[categoria]) {
      acc[categoria] = 0;
    }
    acc[categoria] += gasto.amount;
    return acc;
  }, {} as Record<string, number>);

  const dataPie = Object.entries(gastosPorCategoria).map(([name, value]) => ({
    name,
    value
  }));

  const dataBar = Object.entries(gastosPorCategoria).map(([name, value]) => ({
    category: name,
    amount: value
  }));

  const uniqueCategories = Array.from(new Set(gastos.map(gasto => gasto.category)));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
              Gastos
            </h1>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                backgroundColor: '#FF6B6B',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Novo Gasto
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Pesquisar por descrição"
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
                <option key={category} value={category}>{getCategoriaTraduzida(category)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total de Gastos</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Total de {filteredGastos.length} gastos registrados
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Média por Gasto</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ECDC4' }}>
                R$ {mediaGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Valor médio por registro
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Maior Gasto</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                R$ {maiorGasto.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                {maiorGasto.description || 'Nenhum gasto registrado'}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Menor Gasto</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ECDC4' }}>
                R$ {menorGasto.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                {menorGasto.description || 'Nenhum gasto registrado'}
              </p>
            </div>
          </div>

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
                  <BarChart data={dataBar}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Detalhamento dos Gastos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Descrição</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem', color: '#4b5563' }}>Valor</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Data</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Categoria</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#4b5563' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGastos.map((gasto) => (
                    <tr key={gasto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>{gasto.description}</td>
                      <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                        R$ {gasto.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{new Date(gasto.date).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '0.75rem' }}>{getCategoriaTraduzida(gasto.category)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => setSelectedGasto(gasto)}
                          style={{
                            backgroundColor: '#4ECDC4',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            marginRight: '0.5rem'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setGastoToDelete(gasto)}
                          style={{
                            backgroundColor: '#FF6B6B',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem'
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showCreateForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                width: '500px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  marginBottom: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>Novo Gasto</h2>
                <form onSubmit={handleCreateSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#4b5563',
                      fontWeight: '500'
                    }}>Descrição</label>
                    <input
                      type="text"
                      value={newGasto.description}
                      onChange={e => setNewGasto({ ...newGasto, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#4b5563',
                      fontWeight: '500'
                    }}>Valor</label>
                    <input
                      type="number"
                      value={newGasto.amount}
                      onChange={e => setNewGasto({ ...newGasto, amount: parseFloat(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        outline: 'none'
                      }}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#4b5563',
                      fontWeight: '500'
                    }}>Categoria</label>
                    <select
                      value={newGasto.category}
                      onChange={e => setNewGasto({ ...newGasto, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        outline: 'none'
                      }}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="ALIMENTACAO">ALIMENTACAO</option>
                      <option value="TRANSPORTE">TRANSPORTE</option>
                      <option value="SAUDE">SAUDE</option>
                      <option value="EDUCACAO">EDUCACAO</option>
                      <option value="MORADIA">MORADIA</option>
                      <option value="LAZER">LAZER</option>
                      <option value="VESTUARIO">VESTUARIO</option>
                      <option value="SERVICOS">SERVICOS</option>
                      <option value="IMPOSTOS">IMPOSTOS</option>
                      <option value="SEGUROS">SEGUROS</option>
                      <option value="PRESENTES">PRESENTES</option>
                      <option value="VIAGENS">VIAGENS</option>
                      <option value="OUTROS">OUTROS</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      style={{
                        backgroundColor: '#e5e7eb',
                        color: '#4b5563',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        flex: 1,
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#FF6B6B',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        flex: 1,
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      Adicionar Gasto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {selectedGasto && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                width: '500px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  marginBottom: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>Editar Gasto</h2>
                <form onSubmit={handleEditSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#4b5563',
                      fontWeight: '500'
                    }}>Descrição</label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#4b5563',
                      fontWeight: '500'
                    }}>Valor</label>
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={e => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        outline: 'none'
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#4b5563',
                      fontWeight: '500'
                    }}>Categoria</label>
                    <select
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        outline: 'none'
                      }}
                    >
                      <option value="ALIMENTACAO">ALIMENTACAO</option>
                      <option value="TRANSPORTE">TRANSPORTE</option>
                      <option value="SAUDE">SAUDE</option>
                      <option value="EDUCACAO">EDUCACAO</option>
                      <option value="MORADIA">MORADIA</option>
                      <option value="LAZER">LAZER</option>
                      <option value="VESTUARIO">VESTUARIO</option>
                      <option value="SERVICOS">SERVICOS</option>
                      <option value="IMPOSTOS">IMPOSTOS</option>
                      <option value="SEGUROS">SEGUROS</option>
                      <option value="PRESENTES">PRESENTES</option>
                      <option value="VIAGENS">VIAGENS</option>
                      <option value="OUTROS">OUTROS</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedGasto(null)}
                      style={{
                        backgroundColor: '#e5e7eb',
                        color: '#4b5563',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        flex: 1,
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#FF6B6B',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        flex: 1,
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {gastoToDelete && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                width: '420px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  marginBottom: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>Confirmar Exclusão</h2>
                <p style={{
                  color: '#4b5563',
                  marginBottom: '2rem',
                  fontSize: '1.1rem'
                }}>Tem certeza que deseja excluir este gasto?</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem'
                }}>
                  <button
                    onClick={() => setGastoToDelete(null)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white',
                      color: '#4b5563',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
