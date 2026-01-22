import React from 'react';
import { Student } from '../types';
import { Trash2, User } from 'lucide-react';
import { deleteStudent } from '../services/studentService';

interface StudentListProps {
  students: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ students }) => {

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
      await deleteStudent(id);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 font-bold';
    if (score >= 50) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Öğrenci Listesi</h3>
        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{students.length} Kayıt</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">No</th>
              <th className="px-6 py-3 font-medium">Ad Soyad</th>
              <th className="px-6 py-3 font-medium">Sınıf</th>
              <th className="px-6 py-3 font-medium">Cinsiyet</th>
              <th className="px-6 py-3 font-medium text-center">T1</th>
              <th className="px-6 py-3 font-medium text-center">T2</th>
              <th className="px-6 py-3 font-medium text-center">T3</th>
              <th className="px-6 py-3 font-medium text-center">Ortalama</th>
              <th className="px-6 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                  Henüz kayıtlı öğrenci bulunmamaktadır.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{student.studentNo}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 text-slate-500">
                      <User size={16} />
                    </div>
                    {student.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.className}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.gender}</td>
                  <td className={`px-6 py-4 text-sm text-center ${getScoreColor(student.score1)}`}>{student.score1}</td>
                  <td className={`px-6 py-4 text-sm text-center ${getScoreColor(student.score2)}`}>{student.score2}</td>
                  <td className={`px-6 py-4 text-sm text-center ${getScoreColor(student.score3)}`}>{student.score3}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-slate-800">
                    {student.average.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};