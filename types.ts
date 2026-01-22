export interface Student {
  id: string;
  studentNo: string;
  fullName: string;
  gender: 'Erkek' | 'Kız';
  className: string;
  score1: number;
  score2: number;
  score3: number;
  average: number;
}

export type StudentInput = Omit<Student, 'id' | 'average'>;

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}
