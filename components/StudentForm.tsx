import React, { useState } from 'react';
import { addStudent } from '../services/studentService';
import { StudentInput } from '../types';
import { Save, X } from 'lucide-react';

interface StudentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const initialFormState: StudentInput = {
  studentNo: '',
  fullName: '',
  gender: 'Erkek',
  className: '',
  score1: 0,
  score2: 0,
  score3: 0,
};

export const StudentForm: React.FC<StudentFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<StudentInput>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('score') ? Number(value) : value
    }));
  };

  const validate = (): boolean => {
    if (!formData.studentNo || !formData.fullName || !formData.className) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return false;
    }
    if ([formData.score1, formData.score2, formData.score3].some(s => s < 0 || s > 100)) {
      setError("Puanlar 0 ile 100 arasında olmalıdır.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError(null);
    try {
      await addStudent(formData);
      setFormData(initialFormState);
      onSuccess();
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Yeni Öğrenci Ekle</h2>
        <p className="text-sm text-slate-500">Öğrenci bilgilerini ve temrin notlarını giriniz.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Kimlik Bilgileri</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Öğrenci No</label>
              <input
                type="text"
                name="studentNo"
                value={formData.studentNo}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: 105"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: Ali Yılmaz"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sınıf</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: 11-A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cinsiyet</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Erkek">Erkek</option>
                  <option value="Kız">Kız</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scores Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Temrin Notları (0-100)</h3>
            
            {[1, 2, 3].map((num) => (
              <div key={num}>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temrin {num} Puanı</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name={`score${num}`}
                    value={formData[`score${num}` as keyof StudentInput]}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="ml-2 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (formData[`score${num}` as keyof StudentInput] as number) >= 50 ? 'bg-green-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${formData[`score${num}` as keyof StudentInput]}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};