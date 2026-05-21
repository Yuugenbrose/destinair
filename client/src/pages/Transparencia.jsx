import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Heart, Target, Filter, DollarSign } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Transparencia.css';

const barData = [
  { state: 'SP', fdca: 2800000, fdi: 1900000 },
  { state: 'MG', fdca: 1500000, fdi: 1100000 },
  { state: 'RJ', fdca: 1200000, fdi: 850000 },
  { state: 'PR', fdca: 980000, fdi: 720000 },
  { state: 'RS', fdca: 850000, fdi: 600000 },
  { state: 'BA', fdca: 620000, fdi: 400000 },
  { state: 'SC', fdca: 580000, fdi: 450000 },
  { state: 'GO', fdca: 420000, fdi: 310000 },
];

const pieData = [
  { name: 'FDCA', value: 62, color: '#0EA5E9' },
  { name: 'FDI', value: 38, color: '#10B981' },
];

const lineData = [
  { year: '2019', total: 1200000 },
  { year: '2020', total: 980000 },
  { year: '2021', total: 1450000 },
  { year: '2022', total: 1800000 },
  { year: '2023', total: 2200000 },
  { year: '2024', total: 2850000 },
];

const catData = [
  { name: 'Educação', value: 35, color: '#0EA5E9' },
  { name: 'Saúde', value: 25, color: '#10B981' },
  { name: 'Esporte', value: 18, color: '#F59E0B' },
  { name: 'Cultura', value: 12, color: '#8B5CF6' },
  { name: 'Assistência Social', value: 10, color: '#EC4899' },
];

const fmt = v => 'R$ '+(v/1000000).toFixed(1)+'M';

export default function Transparencia() {
  const [year, setYear] = useState('2024');
  const rootRef = useScrollReveal();
  return (
    <div className="transparencia" ref={rootRef}>
      <section className="cf-hero section--dark" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{color:'var(--color-accent-light)'}}>Transparência</span>
            <h1 className="section-header__title">Para onde vai o seu imposto?</h1>
            <p className="section-header__subtitle">Acompanhe em tempo real a arrecadação, distribuição e impacto dos recursos destinados aos fundos sociais.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* KPIs */}
          <div className="grid grid--4 mb-8">
            {[
              { icon: TrendingUp, value: 'R$ 18,5M', label: 'Total arrecadado' },
              { icon: DollarSign, value: '342', label: 'Projetos financiados' },
              { icon: Users, value: '48.200', label: 'Pessoas beneficiadas' },
              { icon: Heart, value: '1.240', label: 'Fundos cadastrados' },
            ].map((k,i) => (
              <div key={i} className="kpi-card card card--flat">
                <div className="kpi-card__icon" style={{background:'var(--color-secondary-100)',color:'var(--color-secondary-600)'}}><k.icon size={24}/></div>
                <div className="kpi-card__value">{k.value}</div>
                <div className="kpi-card__label">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="trans-charts">
            <div className="trans-chart card" data-reveal style={{ '--reveal-delay': '80ms' }}>
              <h3>Arrecadação por estado (Top 8)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"/>
                  <XAxis dataKey="state" tick={{fontSize:12}}/>
                  <YAxis tickFormatter={v=>'R$'+(v/1000)+'k'} tick={{fontSize:11}}/>
                  <Tooltip formatter={v=>fmt(v)} />
                  <Legend/>
                  <Bar dataKey="fdca" name="FDCA" fill="#0EA5E9" radius={[4,4,0,0]}/>
                  <Bar dataKey="fdi" name="FDI" fill="#10B981" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="trans-chart trans-chart--small card" data-reveal style={{ '--reveal-delay': '160ms' }}>
              <h3>Distribuição FDCA vs FDI</h3>
              <div className="pie-block">
                <div className="pie-legend">
                  <ul>
                    {pieData.map((d, i) => (
                      <li key={i}><span className="pie-swatch" style={{background: d.color}}></span><span className="pie-label">{d.name}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({value})=>`${value}%`} labelLine={false}>
                        {pieData.map((e,i)=>(<Cell key={i} fill={e.color}/>))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="trans-chart trans-chart--small card" data-reveal style={{ '--reveal-delay': '240ms' }}>
              <h3>Projetos por categoria</h3>
              <div className="pie-block">
                <div className="pie-legend">
                  <ul>
                    {catData.map((d, i) => (
                      <li key={i}><span className="pie-swatch" style={{background: d.color}}></span><span className="pie-label">{d.name}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={catData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({value})=>`${value}%`} labelLine={false}>
                        {catData.map((e,i)=>(<Cell key={i} fill={e.color}/>))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="trans-chart card trans-chart--line" data-reveal style={{ '--reveal-delay': '320ms' }}>
              <h3>Evolução da arrecadação (últimos 6 anos)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"/>
                  <XAxis dataKey="year" tick={{fontSize:12}}/>
                  <YAxis tickFormatter={v=>'R$'+(v/1000000).toFixed(1)+'M'} tick={{fontSize:11}}/>
                  <Tooltip formatter={v=>fmt(v)}/>
                  <Line type="monotone" dataKey="total" stroke="#0EA5E9" strokeWidth={3} dot={{r:5,fill:'#0EA5E9'}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
