export interface Student {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    category: string;
    city: string;
    country: string;
    countryCode: string;
    institute: string;
    updatedAt: string;
}

export interface Tutor {
    id: string;
    fullName: string;
    phoneNumber: string;
    city: string;
    country: string;
    countryCode: string;
    expertise1: string;
    expertise2: string;
    expertise3: string;
    updatedAt: string;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    lastLogin: string;
}

export interface Post {
    id: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    description: string;
    status: 'active' | 'completed' | 'cancelled';
    studentId: string;
    subject: string;
    title: string;
    tokens: number;
}
