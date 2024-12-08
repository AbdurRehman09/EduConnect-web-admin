import { db } from '@/lib/firebase';
import { Student, Tutor, Admin, Post } from '@/types';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';

// Admins
export const getAdmins = async (): Promise<Admin[]> => {
    try {
        console.log('Fetching admins from Firestore...');
        const adminsCollection = collection(db, 'admins');
        console.log('Collection reference:', adminsCollection.path);
        
        const snapshot = await getDocs(adminsCollection);
        console.log('Snapshot received:', !snapshot.empty, 'Size:', snapshot.size);
        
        const admins: Admin[] = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Document data:', { id: doc.id, ...data });
            admins.push({
                id: doc.id,
                name: data.name || '',
                email: data.email || '',
                role: data.role || 'admin',
                lastLogin: data.lastLogin || new Date().toISOString()
            });
        });
        
        console.log('Processed admins:', admins);
        return admins;
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }
};

export const addAdmin = async (admin: Omit<Admin, 'id'>) => {
    const adminsCollection = collection(db, 'admins');
    const docRef = await addDoc(adminsCollection, {
        ...admin,
        lastLogin: new Date().toISOString()
    });
    return docRef.id;
};

export const updateAdmin = async (id: string, admin: Partial<Admin>) => {
    const adminRef = doc(db, 'admins', id);
    await updateDoc(adminRef, admin);
};

export const deleteAdmin = async (id: string) => {
    const adminRef = doc(db, 'admins', id);
    await deleteDoc(adminRef);
};

// Students
export const getStudents = async (): Promise<Student[]> => {
    try {
        console.log('Fetching students from Firestore...');
        const studentsCollection = collection(db, 'students');
        console.log('Collection reference:', studentsCollection.path);
        
        const snapshot = await getDocs(studentsCollection);
        console.log('Snapshot received:', !snapshot.empty, 'Size:', snapshot.size);
        
        const students: Student[] = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Document data:', { id: doc.id, ...data });
            students.push({
                id: doc.id,
                fullName: data.fullName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                category: data.category || '',
                city: data.city || '',
                country: data.country || '',
                countryCode: data.countryCode || '',
                institute: data.institute || '',
                updatedAt: data.updatedAt || new Date().toISOString()
            });
        });
        
        console.log('Processed students:', students);
        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Tutors
export const getTutors = async (): Promise<Tutor[]> => {
    try {
        console.log('Fetching tutors from Firestore...');
        const tutorsCollection = collection(db, 'tutors');
        console.log('Collection reference:', tutorsCollection.path);
        
        const snapshot = await getDocs(tutorsCollection);
        console.log('Snapshot received:', !snapshot.empty, 'Size:', snapshot.size);
        
        const tutors: Tutor[] = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Document data:', { id: doc.id, ...data });
            tutors.push({
                id: doc.id,
                fullName: data.fullName || '',
                phoneNumber: data.phoneNumber || '',
                city: data.city || '',
                country: data.country || '',
                countryCode: data.countryCode || '',
                expertise1: data.expertise1 || '',
                expertise2: data.expertise2 || '',
                expertise3: data.expertise3 || '',
                updatedAt: data.updatedAt || new Date().toISOString()
            });
        });
        
        console.log('Processed tutors:', tutors);
        return tutors;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
};

// Posts
export const getPosts = async (): Promise<Post[]> => {
    try {
        const postsCollection = collection(db, 'posts');
        const snapshot = await getDocs(postsCollection);
        const posts: Post[] = [];

        snapshot.forEach((doc) => {
            const postData = doc.data();
            posts.push({
                id: doc.id,
                amount: postData.amount || 0,
                createdAt: postData.createdAt || new Date().toISOString(),
                updatedAt: postData.updatedAt || new Date().toISOString(),
                description: postData.description || '',
                status: postData.status || 'active',
                studentId: postData.studentId || '',
                subject: postData.subject || '',
                title: postData.title || '',
                tokens: postData.tokens || 0
            });
        });

        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

// CRUD operations for Students
export const addStudent = async (student: Omit<Student, 'id'>) => {
    const studentsCollection = collection(db, 'students');
    const docRef = await addDoc(studentsCollection, {
        ...student,
        updatedAt: new Date().toISOString()
    });
    return docRef.id;
};

export const updateStudent = async (id: string, student: Partial<Student>) => {
    const studentRef = doc(db, 'students', id);
    await updateDoc(studentRef, {
        ...student,
        updatedAt: new Date().toISOString()
    });
};

export const deleteStudent = async (id: string) => {
    const studentRef = doc(db, 'students', id);
    await deleteDoc(studentRef);
};

// CRUD operations for Tutors
export const addTutor = async (tutor: Omit<Tutor, 'id'>) => {
    const tutorsCollection = collection(db, 'tutors');
    const docRef = await addDoc(tutorsCollection, {
        ...tutor,
        updatedAt: new Date().toISOString()
    });
    return docRef.id;
};

export const updateTutor = async (id: string, tutor: Partial<Tutor>) => {
    const tutorRef = doc(db, 'tutors', id);
    await updateDoc(tutorRef, {
        ...tutor,
        updatedAt: new Date().toISOString()
    });
};

export const deleteTutor = async (id: string) => {
    const tutorRef = doc(db, 'tutors', id);
    await deleteDoc(tutorRef);
};

// CRUD operations for Posts
export const addPost = async (post: Omit<Post, 'id'>) => {
    const postsCollection = collection(db, 'posts');
    const docRef = await addDoc(postsCollection, {
        ...post,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return docRef.id;
};

export const updatePost = async (id: string, post: Partial<Post>) => {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
        ...post,
        updatedAt: new Date().toISOString()
    });
};

export const deletePost = async (id: string) => {
    const postRef = doc(db, 'posts', id);
    await deleteDoc(postRef);
};
