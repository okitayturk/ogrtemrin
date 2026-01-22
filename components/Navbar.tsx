import React from 'react';
import { GraduationCap, LayoutDashboard, Users, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'list' | 'add';
  setView: (view: 'dashboard' | 'list' | 'add') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-slate-800">E-Temrin</span>
          </div>
          <div className="flex space-x-4 items-center">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Panel
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Öğrenciler
            </button>
            <button
              onClick={() => setView('add')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'add'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Yeni Kayıt
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};