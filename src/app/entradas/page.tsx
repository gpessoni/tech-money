'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";

enum TipoEntrada {
  SALARY = 'SALÁRIO',
  FREELANCE = 'FREELANCER',
  INVESTMENT = 'INVESTIMENTO',
  RENT = 'ALUGUEL',
  OTHER = 'OUTROS'
}

interface Income {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  userId: string;
}

interface EditForm {
  description: string;
  amount: number;
  type: string;
}

interface CreateForm {
  description: string;
  amount: number;
  type: string;
}

const getTipoTraduzido = (tipo: string): string => {
  switch (tipo) {
    case 'SALARY':
      return TipoEntrada.SALARY;
    case 'FREELANCE':
      return TipoEntrada.FREELANCE;
    case 'INVESTMENT':
      return TipoEntrada.INVESTMENT;
    case 'RENT':
      return TipoEntrada.RENT;
    case 'OTHER':
      return TipoEntrada.OTHER;
    default:
      return tipo;
  }
};

export default function Entradas() {
  const [entradas, setEntradas] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedEntrada, setSelectedEntrada] = useState<Income | null>(null);
  const [entradaToDelete, setEntradaToDelete] = useState<Income | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    description: '',
    amount: 0,
    type: ''
  });

  const [newEntrada, setNewEntrada] = useState<CreateForm>({
    description: '',
    amount: 0,
    type: ''
  });

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar entradas');
        }

        const data = await response.json();
        setEntradas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro');
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  useEffect(() => {
    if (selectedEntrada) {
      setEditForm({
        description: selectedEntrada.description,
        amount: selectedEntrada.amount,
        type: selectedEntrada.type
      });
    }
  }, [selectedEntrada]);


  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEntrada)
      });

      if (!response.ok) throw new Error('Falha ao criar entrada');

      const createdEntrada = await response.json();
      setEntradas([...entradas, createdEntrada]);
      setNewEntrada({
        description: '',
        amount: 0,
        type: ''
      });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntrada) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incomes/${selectedEntrada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Falha ao atualizar entrada');

      const updatedEntrada = await response.json();
      setEntradas(entradas.map(entrada =>
        entrada.id === updatedEntrada.id ? updatedEntrada : entrada
      ));
      setSelectedEntrada(null);
      setShowCreateForm(false);
      setEditForm({
        description: '',
        amount: 0,
        type: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  const handleDelete = async () => {
    if (!entradaToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incomes/${entradaToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Falha ao excluir entrada');

      setEntradas(entradas.filter(entrada => entrada.id !== entradaToDelete.id));
      setEntradaToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  const filteredEntradas = entradas.filter(entrada => {
    const matchesSearch = search === '' || entrada.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === '' || entrada.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalEntradas = filteredEntradas.reduce((acc, entrada) => acc + entrada.amount, 0);
  const mediaEntradas = filteredEntradas.length > 0 ? totalEntradas / filteredEntradas.length : 0;
  const maiorEntrada = Math.max(...filteredEntradas.map(e => e.amount), 0);
  const menorEntrada = Math.min(...filteredEntradas.map(e => e.amount), 0);

  const entradasPorTipo = filteredEntradas.reduce((acc, entrada) => {
    const tipo = getTipoTraduzido(entrada.type);
    if (!acc[tipo]) {
      acc[tipo] = 0;
    }
    acc[tipo] += entrada.amount;
    return acc;
  }, {} as Record<string, number>);

  const dataPie = Object.entries(entradasPorTipo).map(([name, value]) => ({
    name,
    value
  }));

  const dataBar = Object.entries(entradasPorTipo).map(([name, value]) => ({
    type: name,
    amount: value
  }));


  const uniqueTypes = Array.from(new Set(entradas.map(entrada => entrada.type)));

  const COLORS = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4', '#FFC107', '#795548'];

  const clearFilters = () => {
    setSearch('');
    setFilterType('');
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
              Entradas
            </h1>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Nova Entrada
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Pesquisar por descrição"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              >
                <option value="">Todos os Tipos</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{getTipoTraduzido(type)}</option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                style={{
                  padding: '0.25rem',
                  borderRadius: '0.5rem',
                  color: '#4b5563',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  backgroundColor: '#f3f4f6',
                  fontSize: '1rem',
                  width: 'fit-content',
                  height: 'fit-content',
                  alignSelf: 'center',
                  justifySelf: 'start'
                }}
              >
                Limpar
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total de Entradas</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                  R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Média por Entrada</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196F3' }}>
                  R$ {mediaEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Maior Entrada</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
                  R$ {maiorEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Menor Entrada</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#E91E63' }}>
                  R$ {menorEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Distribuição das Entradas por Tipo</h2>
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Entradas por Tipo</h2>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataBar}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Detalhamento das Entradas</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Descrição</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: '#4b5563' }}>Valor</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Data</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#4b5563' }}>Tipo</th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#4b5563' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntradas.map((entrada, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{entrada.description}</td>
                        <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                          R$ {(entrada.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem' }}>{new Date(entrada.date).toLocaleDateString('pt-BR')}</td>
                        <td style={{ padding: '0.75rem' }}>{getTipoTraduzido(entrada.type)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedEntrada(entrada)}
                            style={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.25rem',
                              marginRight: '0.5rem',
                              cursor: 'pointer'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setEntradaToDelete(entrada)}
                            style={{
                              backgroundColor: '#E91E63',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.25rem',
                              cursor: 'pointer'
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
                    }}>Nova Entrada</h2>
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
                          value={newEntrada.description}
                          onChange={e => setNewEntrada({ ...newEntrada, description: e.target.value })}
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
                          value={newEntrada.amount}
                          onChange={e => setNewEntrada({ ...newEntrada, amount: parseFloat(e.target.value) })}
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
                        }}>Tipo</label>
                        <select
                          value={newEntrada.type}
                          onChange={e => setNewEntrada({ ...newEntrada, type: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            outline: 'none'
                          }}
                          required
                        >
                          <option value="">Selecione um tipo</option>
                          <option value="SALARY">Salário</option>
                          <option value="FREELANCE">Freelancer</option>
                          <option value="INVESTMENT">Investimento</option>
                          <option value="RENT">Aluguel</option>
                          <option value="OTHER">Outros</option>
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
                            backgroundColor: '#4CAF50',
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
                          Adicionar Entrada
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal de Edição */}
              {selectedEntrada && (
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
                    }}>Editar Entrada</h2>
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
                            outline: 'none',
                            transition: 'border-color 0.2s ease',
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
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          color: '#4b5563',
                          fontWeight: '500'
                        }}>Tipo</label>
                        <select
                          value={editForm.type}
                          onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            outline: 'none',
                            transition: 'border-color 0.2s ease',
                            backgroundColor: 'white'
                          }}
                        >
                          {Object.keys(TipoEntrada).map(tipo => (
                            <option key={tipo} value={tipo}>{getTipoTraduzido(tipo)}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '2rem'
                      }}>
                        <button
                          type="button"
                          onClick={() => setSelectedEntrada(null)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            color: '#4b5563',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal de Confirmação de Exclusão */}
              {entradaToDelete && (
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
                    }}>Tem certeza que deseja excluir esta entrada?</p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '1rem'
                    }}>
                      <button
                        onClick={() => setEntradaToDelete(null)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb',
                          backgroundColor: 'white',
                          color: '#4b5563',
                          fontWeight: '500',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.5rem',
                          fontWeight: '500',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#b91c1c'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
