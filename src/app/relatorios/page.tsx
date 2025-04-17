'use client';

import Navbar from '@/components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  yield?: number;
}

export default function Home() {
  const router = useRouter();
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [incomesRes, expensesRes, investmentsRes] = await Promise.all([
          fetch('/api/incomes', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/expenses', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/investments', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!incomesRes.ok || !expensesRes.ok || !investmentsRes.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const [incomesData, expensesData, investmentsData] = await Promise.all([
          incomesRes.json(),
          expensesRes.json(),
          investmentsRes.json()
        ]);

        setIncomes(incomesData);
        setExpenses(expensesData);
        setInvestments(investmentsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const totalIncomes = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalInvestments = investments.reduce((acc, curr) => acc + curr.amount, 0);
  const saldoTotal = totalIncomes - totalExpenses + totalInvestments;

  const mediaReceitas = totalIncomes / (incomes.length || 1);
  const mediaDespesas = totalExpenses / (expenses.length || 1);
  const percentualEconomia = ((totalIncomes - totalExpenses) / totalIncomes) * 100 || 0;
  const percentualInvestido = (totalInvestments / totalIncomes) * 100 || 0;
  const rendimentoTotal = investments.reduce((acc, curr) => acc + (curr.yield || 0), 0);
  const rendimentoMedio = rendimentoTotal / (investments.length || 1);

  const dadosGrafico = [
    { name: 'Receitas', value: totalIncomes },
    { name: 'Despesas', value: totalExpenses },
    { name: 'Investimentos', value: totalInvestments }
  ];

  const agruparPorMes = (transactions: Transaction[]) => {
    return transactions.reduce((acc: { [key: string]: number }, curr) => {
      const mes = new Date(curr.date).toLocaleString('pt-BR', { month: 'short' });
      if (!acc[mes]) acc[mes] = 0;
      acc[mes] += curr.amount;
      return acc;
    }, {});
  };

  const agruparPorCategoria = (transactions: Transaction[]) => {
    return transactions.reduce((acc: { [key: string]: number }, curr) => {
      const categoria = curr.category || 'Outros';
      if (!acc[categoria]) acc[categoria] = 0;
      acc[categoria] += curr.amount;
      return acc;
    }, {});
  };

  const calcularTendenciaGastos = () => {
    if (expenses.length < 2) return 0;
    
    const mesesOrdenados = Object.entries(mesesExpenses)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    
    if (mesesOrdenados.length < 2) return 0;
    
    const ultimoMes = mesesOrdenados[mesesOrdenados.length - 1][1];
    const penultimoMes = mesesOrdenados[mesesOrdenados.length - 2][1];
    
    return ((ultimoMes - penultimoMes) / penultimoMes) * 100;
  };

  const mesesIncomes = agruparPorMes(incomes);
  const mesesExpenses = agruparPorMes(expenses);
  const mesesInvestments = agruparPorMes(investments);
  const categoriasDespesas = agruparPorCategoria(expenses);
  const tendenciaGastos = calcularTendenciaGastos();

  const dadosMensais = Object.keys(mesesIncomes).map(mes => ({
    mes,
    receitas: mesesIncomes[mes] || 0,
    despesas: mesesExpenses[mes] || 0,
    investimentos: mesesInvestments[mes] || 0,
    saldo: (mesesIncomes[mes] || 0) - (mesesExpenses[mes] || 0)
  }));

  const dadosCategorias = Object.entries(categoriasDespesas).map(([categoria, valor]) => ({
    categoria,
    valor
  }));

  const COLORS = ['#059669', '#dc2626', '#3b82f6', '#f59e0b', '#8b5cf6'];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarPorcentagem = (valor: number) => {
    return valor.toFixed(1) + '%';
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
            Controle Financeiro Pessoal
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Saldo Total</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: saldoTotal >= 0 ? '#059669' : '#dc2626' }}>
                {formatarMoeda(saldoTotal)}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {saldoTotal >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Receitas</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{formatarMoeda(totalIncomes)}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Média: {formatarMoeda(mediaReceitas)}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Despesas</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>{formatarMoeda(totalExpenses)}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Média: {formatarMoeda(mediaDespesas)}
                <br />
                Tendência: {tendenciaGastos > 0 ? '↑' : '↓'} {formatarPorcentagem(Math.abs(tendenciaGastos))}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Investimentos</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{formatarMoeda(totalInvestments)}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {formatarPorcentagem(percentualInvestido)} da renda
                <br />
                Rendimento médio: {formatarPorcentagem(rendimentoMedio)}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Taxa de Economia</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{formatarPorcentagem(percentualEconomia)}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {percentualEconomia >= 20 ? 'Ótimo!' : percentualEconomia >= 10 ? 'Bom' : 'Precisa melhorar'}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Total de Transações</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{incomes.length + expenses.length}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Receitas: {incomes.length} | Despesas: {expenses.length}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Média de Gastos por Transação</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{formatarMoeda(mediaDespesas)}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {mediaDespesas > mediaReceitas ? 'Alerta: Gastos elevados' : 'Gastos controlados'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dadosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Evolução Mensal</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosMensais}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                    <Legend />
                    <Bar dataKey="receitas" fill="#059669" name="Receitas" />
                    <Bar dataKey="despesas" fill="#dc2626" name="Despesas" />
                    <Bar dataKey="investimentos" fill="#3b82f6" name="Investimentos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Evolução do Saldo</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosMensais}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="saldo" 
                      stroke="#8b5cf6" 
                      name="Saldo"
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Despesas por Categoria</h2>
              
              {dadosCategorias.length > 0 ? (
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosCategorias}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valor"
                        nameKey="categoria"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dadosCategorias.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <p>Nenhuma despesa registrada</p>
                </div>
              )}
            </div>
          </div>
            
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem' }}>Últimas Transações</h2>
            
            {incomes.length > 0 ? (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: '#059669' }}>Receitas</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Descrição</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Data</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomes
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((income) => (
                          <tr key={income.id} style={{ transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{income.description}</td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{formatarData(income.date)}</td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right', color: '#059669' }}>
                              +{formatarMoeda(income.amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                <p>Nenhuma receita registrada</p>
              </div>
            )}

            {expenses.length > 0 ? (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: '#dc2626' }}>Despesas</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Descrição</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Data</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Categoria</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((expense) => (
                          <tr key={expense.id} style={{ transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{expense.description}</td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{formatarData(expense.date)}</td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                backgroundColor: '#e5e7eb', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '0.25rem',
                                display: 'inline-block'
                              }}>
                                {expense.category || 'Sem categoria'}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right', color: '#dc2626' }}>
                              -{formatarMoeda(expense.amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>  </>
            )}

            {investments.length > 0 ? (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: '#3b82f6' }}>Investimentos</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Categoria</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Yield</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Data</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((investment) => (
                          <tr key={investment.id} style={{ transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{investment.category || 'Sem categoria'}</td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                              <span style={{ 
                                color: investment.yield && investment.yield > 0 ? '#059669' : '#dc2626'
                              }}>
                                {investment.yield}%
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{formatarData(investment.date)}</td>
                            <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right', color: '#3b82f6' }}>
                              {formatarMoeda(investment.amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <p>Nenhum investimento registrado</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}