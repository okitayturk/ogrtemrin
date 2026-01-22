import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { StudentForm } from './components/StudentForm';
import { subscribeToStudents } from './services/studentService';
import { Student } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'add'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time subscription to Firebase
  useEffect(() => {
    const unsubscribe = subscribeToStudents((data) => {
      setStudents(data);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleFormSuccess = () => {
    setCurrentView('list');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'list':
        return <StudentList students={students} />;
      case 'add':
        return <StudentForm onSuccess={handleFormSuccess} onCancel={() => setCurrentView('list')} />;
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;