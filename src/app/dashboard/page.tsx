'use client';

import { Tabs, Button } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';
import StudentTable from '@/components/StudentTable';
import TutorTable from '@/components/TutorTable';
import AdminTable from '@/components/AdminTable';
import { Student, Tutor, Admin } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AntdProvider';
import styles from './page.module.css';

// Your existing dummy data...
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
                description: 'Need help with calculus and linear algebra',
            },
            {
                subject: 'Physics',
                hours: 8,
                fees: 400,
                description: 'Help needed with mechanics and thermodynamics',
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
            },
            {
                subject: 'Chemistry',
                hours: 6,
                fees: 350,
                description: 'Help with organic chemistry reactions',
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
            },
            {
                subject: 'Biology',
                hours: 5,
                fees: 250,
                description: 'Help with genetics and cell biology',
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
// Add dummy admin data
const dummyAdmins: Admin[] = [
    {
        id: '1',
        name: 'Super Admin',
        email: 'admin@educonnect.com',
        role: 'super_admin',
        lastLogin: '2024-02-20T10:00:00Z'
    },
    {
        id: '2',
        name: 'John Admin',
        email: 'john.admin@educonnect.com',
        role: 'admin',
        lastLogin: '2024-02-19T15:30:00Z'
    }
];

export default function AdminDashboard() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        logout();
        router.push('/');
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <DashboardOutlined /> Admin Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    <LogoutOutlined /> Logout
                </button>
            </div>

            <div className={styles.tabsContainer}>
                <Tabs
                    defaultActiveKey="students"
                    items={[
                        {
                            key: 'students',
                            label: (
                                <span>
                                    <UserOutlined /> Students
                                </span>
                            ),
                            children: <StudentTable initialData={dummyStudents} />,
                        },
                        {
                            key: 'tutors',
                            label: (
                                <span>
                                    <TeamOutlined /> Tutors
                                </span>
                            ),
                            children: <TutorTable initialData={dummyTutors} />,
                        },
                        {
                            key: 'admins',
                            label: (
                                <span>
                                    <CrownOutlined /> Admins
                                </span>
                            ),
                            children: <AdminTable initialData={dummyAdmins} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
}
