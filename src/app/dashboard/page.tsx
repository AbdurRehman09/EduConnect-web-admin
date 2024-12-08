'use client';

import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';
import StudentTable from '@/components/StudentTable';
import TutorTable from '@/components/TutorTable';
import AdminTable from '@/components/AdminTable';
import { Student, Tutor, Admin } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { getStudents, getTutors, getAdmins } from '@/lib/services/database';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { logout, user } = useAuth();

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            router.push('/');
            return;
        }

        // Fetch data from Firebase
        const fetchData = async () => {
            try {
                const [studentsData, tutorsData, adminsData] = await Promise.all([
                    getStudents(),
                    getTutors(),
                    getAdmins()
                ]);

                // Convert objects to arrays with IDs
                setStudents(Object.entries(studentsData).map(([id, data]) => ({
                    id,
                    ...data as Omit<Student, 'id'>
                })));
                
                setTutors(Object.entries(tutorsData).map(([id, data]) => ({
                    id,
                    ...data as Omit<Tutor, 'id'>
                })));
                
                setAdmins(Object.entries(adminsData).map(([id, data]) => ({
                    id,
                    ...data as Omit<Admin, 'id'>
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <DashboardOutlined /> Admin Dashboard
                </h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
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
                            children: <StudentTable initialData={students} />,
                        },
                        {
                            key: 'tutors',
                            label: (
                                <span>
                                    <TeamOutlined /> Tutors
                                </span>
                            ),
                            children: <TutorTable initialData={tutors} />,
                        },
                        {
                            key: 'admins',
                            label: (
                                <span>
                                    <CrownOutlined /> Admins
                                </span>
                            ),
                            children: <AdminTable initialData={admins} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
}
