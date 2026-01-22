import React, { useMemo, useState } from 'react';
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
import { Users, TrendingUp, Award, AlertCircle, TrendingDown, Filter } from 'lucide-react';

interface DashboardProps {
  students: Student[];
}

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

export const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const [selectedClass, setSelectedClass] = useState<string>('Tüm Sınıflar');

  // Extract unique classes from student list
  const distinctClasses = useMemo(() => {
    const classes = new Set(students.map(s => s.className).filter(c => c && c.trim() !== ''));
    return Array.from(classes).sort();
  }, [students]);

  // Filter students based on selection
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'Tüm Sınıflar') return students;
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  const stats = useMemo(() => {
    if (filteredStudents.length === 0) return null;

    const totalStudents = filteredStudents.length;
    const avgScore1 = filteredStudents.reduce((acc, s) => acc + s.score1, 0) / totalStudents;
    const avgScore2 = filteredStudents.reduce((acc, s) => acc + s.score2, 0) / totalStudents;
    const avgScore3 = filteredStudents.reduce((acc, s) => acc + s.score3, 0) / totalStudents;
    const overallAvg = (avgScore1 + avgScore2 + avgScore3) / 3;

    // Gender data calculation (Average Scores)
    const maleStudents = filteredStudents.filter(s => s.gender === 'Erkek');
    const femaleStudents = filteredStudents.filter(s => s.gender === 'Kız');

    const calculateGroupAvg = (group: Student[]) => {
      if (group.length === 0) return 0;
      const sum = group.reduce((acc, s) => acc + s.average, 0);
      return parseFloat((sum / group.length).toFixed(1));
    };

    const maleAvg = calculateGroupAvg(maleStudents);
    const femaleAvg = calculateGroupAvg(femaleStudents);

    // Performance data for Bar Chart
    const performanceData = [
      { name: 'Temrin 1', puan: parseFloat(avgScore1.toFixed(1)) },
      { name: 'Temrin 2', puan: parseFloat(avgScore2.toFixed(1)) },
      { name: 'Temrin 3', puan: parseFloat(avgScore3.toFixed(1)) },
    ];

    const genderData = [
      { name: 'Erkek Ort.', value: maleAvg },
      { name: 'Kız Ort.', value: femaleAvg },
    ];

    // Find top student
    const topStudent = filteredStudents.reduce((prev, current) => 
      (prev.average > current.average) ? prev : current
    );

    // Find lowest student
    const lowestStudent = filteredStudents.reduce((prev, current) => 
      (prev.average < current.average) ? prev : current
    );

    return {
      totalStudents,
      overallAvg,
      performanceData,
      genderData,
      topStudent,
      lowestStudent
    };
  }, [filteredStudents]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 sm:mb-0">
          {selectedClass === 'Tüm Sınıflar' ? 'Genel Performans Analizi' : `${selectedClass} Sınıfı Analizi`}
        </h2>
        
        <div className="flex items-center space-x-3">
          <Filter className="text-slate-400 w-5 h-5" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-slate-50 text-slate-700"
          >
            <option value="Tüm Sınıflar">Tüm Sınıflar</option>
            {distinctClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {!stats ? (
        <div className="flex flex-col items-center justify-center h-80 text-slate-500 bg-white rounded-xl border border-slate-100 border-dashed">
          <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg">Bu sınıf için henüz analiz edilecek veri yok.</p>
          <p className="text-sm">Veya henüz öğrenci eklenmemiş olabilir.</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Öğrenci Sayısı</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalStudents}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
              <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sınıf Ortalaması</p>
                <p className="text-2xl font-bold text-slate-800">{stats.overallAvg.toFixed(1)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-full mr-4">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">En Başarılı</p>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-800 truncate max-w-[150px]" title={stats.topStudent.fullName}>
                    {stats.topStudent.fullName}
                  </span>
                  <span className="text-xs text-slate-400">Ort: {stats.topStudent.average.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
              <div className="p-3 bg-red-100 text-red-600 rounded-full mr-4">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">En Başarısız</p>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-800 truncate max-w-[150px]" title={stats.lowestStudent.fullName}>
                    {stats.lowestStudent.fullName}
                  </span>
                  <span className="text-xs text-slate-400">Ort: {stats.lowestStudent.average.toFixed(1)}</span>
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
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Cinsiyete Göre Başarı Ortalaması</h3>
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
                    <Tooltip formatter={(value: number) => `${value} Puan`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};