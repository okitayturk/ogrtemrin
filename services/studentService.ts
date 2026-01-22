import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Student, StudentInput } from '../types';

const COLLECTION_NAME = 'students';

export const subscribeToStudents = (callback: (students: Student[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('studentNo', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map(doc => {
      const data = doc.data();
      // Calculate average dynamically if needed, or rely on saved data
      // Ensuring data types
      const score1 = Number(data.score1) || 0;
      const score2 = Number(data.score2) || 0;
      const score3 = Number(data.score3) || 0;
      const average = parseFloat(((score1 + score2 + score3) / 3).toFixed(2));

      return {
        id: doc.id,
        ...data,
        score1,
        score2,
        score3,
        average
      } as Student;
    });
    callback(students);
  });
};

export const addStudent = async (student: StudentInput) => {
  await addDoc(collection(db, COLLECTION_NAME), student);
};

export const deleteStudent = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
