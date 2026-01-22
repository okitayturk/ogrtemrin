import React, { useMemo } from 'react';
import { Student } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, TrendingUp, Award, AlertCircle } from 'lucide-react';

interface DashboardProps {
  students: Student[];
}

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

export const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const stats = useMemo(() => {
    if (students.length === 0) return null;

    const totalStudents = students.length;
    const avgScore1 = students.reduce((acc, s) => acc + s.score1, 0) / totalStudents;
    const avgScore2 = students.reduce((acc, s) => acc + s.score2, 0) / totalStudents;
    const avgScore3 = students.reduce((acc, s) => acc + s.score3, 0) / totalStudents;
    const overallAvg = (avgScore1 + avgScore2 + avgScore3) / 3;

    // Gender data
    const males = students.filter(s => s.gender === 'Erkek').length;
    const females = students.filter(s => s.gender === 'Kız').length;

    // Performance data for Bar Chart
    const performanceData = [
      { name: 'Temrin 1', puan: parseFloat(avgScore1.toFixed(1)) },
      { name: 'Temrin 2', puan: parseFloat(avgScore2.toFixed(1)) },
      { name: 'Temrin 3', puan: parseFloat(avgScore3.toFixed(1)) },
    ];

    const genderData = [
      { name: 'Erkek', value: males },
      { name: 'Kız', value: females },
    ];

    // Find top student
    const topStudent = students.reduce((prev, current) => 
      (prev.average > current.average) ? prev : current
    );

    return {
      totalStudents,
      overallAvg,
      performanceData,
      genderData,
      topStudent
    };
  }, [students]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg">Henüz analiz edilecek veri yok.</p>
        <p className="text-sm">Lütfen önce öğrenci ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Toplam Öğrenci</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Genel Başarı Ort.</p>
            <p className="text-2xl font-bold text-slate-800">{stats.overallAvg.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center col-span-2">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full mr-4">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">En Başarılı Öğrenci</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-xl font-bold text-slate-800">{stats.topStudent.fullName}</p>
              <span className="text-sm text-slate-400">({stats.topStudent.average.toFixed(1)} Puan)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Temrin Başarı Ortalamaları</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="puan" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Cinsiyet Dağılımı</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};