export interface Student {
    id: string;
    name: string;
    cellNo: string;
    city: string;
    country: string;
    tutoringRequests: {
        subject: string;
        hours: number;
        fees: number;
        description: string;
    }[];
}

export interface Tutor {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    city: string;
    country: string;
}
