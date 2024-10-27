'use client';

import { Tabs } from 'antd';
import StudentTable from '@/components/StudentTable';
import TutorTable from '@/components/TutorTable';

export default function AdminDashboard() {
  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: '#D4E2B6' }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#5C8307' }}>
        Admin Dashboard
      </h1>
      <Tabs
        defaultActiveKey="students"
        items={[
          {
            key: 'students',
            label: 'Students',
            children: <StudentTable />,
          },
          {
            key: 'tutors',
            label: 'Tutors',
            children: <TutorTable />,
          },
        ]}
      />
    </div>
  );
}
