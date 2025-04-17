'use client';

import Navbar from "@/components/Navbar";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

interface Investment {
  id: string;
  name: string;
  amount: number;
  yield: number;
  category: string;
  userId: string;
}

export default function Investimentos() {
  const [investimentos, setInvestimentos] = useState<Investment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    yield: 0,
    category: ''
  });

  useEffect(() => {
    fetchInvestimentos();
  }, []);

  const fetchInvestimentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setInvestimentos(data);
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchInvestimentos();
        setFormData({ name: '', amount: 0, yield: 0, category: '' });
      }
    } catch (error) {
      console.error('Erro ao criar investimento:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedInvestment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/investments/${selectedInvestment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchInvestimentos();
        setSelectedInvestment(null);
        setFormData({ name: '', amount: 0, yield: 0, category: '' });
      }
    } catch (error) {
      console.error('Erro ao editar investimento:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedInvestment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/investments/${selectedInvestment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        fetchInvestimentos();
        setSelectedInvestment(null);
      }
    } catch (error) {
      console.error('Erro ao deletar investimento:', error);
    }
  };

  const totalInvestido = investimentos.reduce((acc, inv) => acc + inv.amount, 0);
  const rendimentoTotal = investimentos.reduce((acc, inv) => acc + (inv.amount * inv.yield / 100), 0);

  const dataPie = investimentos.map(inv => ({
    name: inv.category,
    value: inv.amount
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
              Meus Investimentos
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Novo Investimento
            </button>
          </div>

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
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="yield" fill="#8884d8" />
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
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#4b5563' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {investimentos.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>{inv.name}</td>
                      <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                        R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem' }}>{inv.yield}%</td>
                      <td style={{ padding: '0.75rem' }}>{inv.category}</td>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <button
                          onClick={() => {
                            setSelectedInvestment(inv);
                            setFormData({
                              name: inv.name,
                              amount: inv.amount,
                              yield: inv.yield,
                              category: inv.category
                            });
                            setShowEditModal(true);
                          }}
                          style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInvestment(inv);
                            setShowDeleteModal(true);
                          }}
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
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
        </div>
      </main>

      {/* Modal de Criação */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Novo Investimento</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Valor</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rendimento (%)</label>
              <input
                type="number"
                value={formData.yield}
                onChange={(e) => setFormData({ ...formData, yield: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option value="CDB">CDB</option>
                <option value="Ações">Ações</option>
                <option value="Tesouro Direto">Tesouro Direto</option>
                <option value="Fundos Imobiliários">Fundos Imobiliários</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Editar Investimento</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Valor</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rendimento (%)</label>
              <input
                type="number"
                value={formData.yield}
                onChange={(e) => setFormData({ ...formData, yield: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option value="CDB">CDB</option>
                <option value="Ações">Ações</option>
                <option value="Tesouro Direto">Tesouro Direto</option>
                <option value="Fundos Imobiliários">Fundos Imobiliários</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEdit}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Confirmar Exclusão</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Tem certeza que deseja excluir o investimento "{selectedInvestment?.name}"?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
