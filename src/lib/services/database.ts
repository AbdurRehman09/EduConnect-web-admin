import { ref, get, set, push, remove, update } from 'firebase/database';
import { database } from '../firebase';
import type { Student, Tutor, Admin } from '@/types';

// Students
export const getStudents = async () => {
  const studentsRef = ref(database, 'students');
  const snapshot = await get(studentsRef);
  return snapshot.val() || {};
};

export const addStudent = async (student: Omit<Student, 'id'>) => {
  const studentsRef = ref(database, 'students');
  const newStudentRef = push(studentsRef);
  await set(newStudentRef, student);
  return newStudentRef.key;
};

export const updateStudent = async (id: string, student: Partial<Student>) => {
  const studentRef = ref(database, `students/${id}`);
  await update(studentRef, student);
};

export const deleteStudent = async (id: string) => {
  const studentRef = ref(database, `students/${id}`);
  await remove(studentRef);
};

// Tutors
export const getTutors = async () => {
  const tutorsRef = ref(database, 'tutors');
  const snapshot = await get(tutorsRef);
  return snapshot.val() || {};
};

export const addTutor = async (tutor: Omit<Tutor, 'id'>) => {
  const tutorsRef = ref(database, 'tutors');
  const newTutorRef = push(tutorsRef);
  await set(newTutorRef, tutor);
  return newTutorRef.key;
};

export const updateTutor = async (id: string, tutor: Partial<Tutor>) => {
  const tutorRef = ref(database, `tutors/${id}`);
  await update(tutorRef, tutor);
};

export const deleteTutor = async (id: string) => {
  const tutorRef = ref(database, `tutors/${id}`);
  await remove(tutorRef);
};

// Admins
export const getAdmins = async () => {
  const adminsRef = ref(database, 'admins');
  const snapshot = await get(adminsRef);
  return snapshot.val() || {};
};

export const addAdmin = async (admin: Omit<Admin, 'id'>) => {
  const adminsRef = ref(database, 'admins');
  const newAdminRef = push(adminsRef);
  await set(newAdminRef, admin);
  return newAdminRef.key;
};

export const updateAdmin = async (id: string, admin: Partial<Admin>) => {
  const adminRef = ref(database, `admins/${id}`);
  await update(adminRef, admin);
};

export const deleteAdmin = async (id: string) => {
  const adminRef = ref(database, `admins/${id}`);
  await remove(adminRef);
};
