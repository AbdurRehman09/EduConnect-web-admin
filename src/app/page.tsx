'use client';

import { Tabs } from 'antd';
import StudentTable from '@/components/StudentTable';
import TutorTable from '@/components/TutorTable';
import { Student, Tutor } from '@/types';

// Dummy data for students
const dummyStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    cellNo: '+1-234-567-8901',
    city: 'New York',
    country: 'USA',
    tutoringRequests: [
      {
        subject: 'Mathematics',
        hours: 10,
        fees: 500,
        description: 'Need help with calculus',
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    cellNo: '+1-234-567-8902',
    city: 'London',
    country: 'UK',
    tutoringRequests: [
      {
        subject: 'Physics',
        hours: 8,
        fees: 400,
        description: 'Quantum mechanics tutorials',
      }
    ]
  },
  {
    id: '3',
    name: 'Alice Johnson',
    cellNo: '+1-234-567-8903',
    city: 'Toronto',
    country: 'Canada',
    tutoringRequests: [
      {
        subject: 'Chemistry',
        hours: 6,
        fees: 300,
        description: 'Organic chemistry help needed',
      }
    ]
  }
];

// Dummy data for tutors
const dummyTutors: Tutor[] = [
  {
    id: '1',
    fullName: 'Dr. Robert Wilson',
    email: 'robert.wilson@email.com',
    password: 'hashedPassword123',
    phoneNumber: '+1-234-567-8904',
    experienceLevel: 'advanced',
    city: 'Boston',
    country: 'USA'
  },
  {
    id: '2',
    fullName: 'Prof. Sarah Brown',
    email: 'sarah.brown@email.com',
    password: 'hashedPassword456',
    phoneNumber: '+1-234-567-8905',
    experienceLevel: 'intermediate',
    city: 'Manchester',
    country: 'UK'
  },
  {
    id: '3',
    fullName: 'Mr. James Lee',
    email: 'james.lee@email.com',
    password: 'hashedPassword789',
    phoneNumber: '+1-234-567-8906',
    experienceLevel: 'beginner',
    city: 'Vancouver',
    country: 'Canada'
  }
];

export default function AdminDashboard() {
  return (
    <div className=" min-h-screen p-6">
      <h1 className="text-2xl mb-6" style={{ color: "#5C8307" }}>
        Admin Dashboard
      </h1>
      <Tabs
        defaultActiveKey="students"
        items={[
          {
            key: 'students',
            label: 'Students',
            children: <StudentTable initialData={dummyStudents} />,
          },
          {
            key: 'tutors',
            label: 'Tutors',
            children: <TutorTable initialData={dummyTutors} />,
          },
        ]}
      />
    </div>
  );
}
