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
            console.log('No user found, redirecting to login');
            router.push('/');
            return;
        }

        console.log('Current user:', user);

        // Fetch data from Firebase
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Starting data fetch...');

                const [studentsData, tutorsData, adminsData] = await Promise.all([
                    getStudents(),
                    getTutors(),
                    getAdmins()
                ]);

                console.log('Fetched data:', {
                    students: studentsData,
                    tutors: tutorsData,
                    admins: adminsData
                });

                setStudents(studentsData);
                setTutors(tutorsData);
                setAdmins(adminsData);
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
            console.error('Error logging out:', error);
        }
    };

    console.log('Current state:', { students, tutors, admins, loading });

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <UserOutlined />
                    Students ({students.length})
                </span>
            ),
            children: <StudentTable students={students} loading={loading} />
        },
        {
            key: '2',
            label: (
                <span>
                    <TeamOutlined />
                    Tutors ({tutors.length})
                </span>
            ),
            children: <TutorTable tutors={tutors} loading={loading} />
        },
        {
            key: '3',
            label: (
                <span>
                    <CrownOutlined />
                    Admins ({admins.length})
                </span>
            ),
            children: <AdminTable 
                admins={admins} 
                loading={loading} 
                onAdminAdded={() => {
                    // Refresh data when a new admin is added
                    const fetchData = async () => {
                        try {
                            setLoading(true);
                            console.log('Starting data fetch...');

                            const [studentsData, tutorsData, adminsData] = await Promise.all([
                                getStudents(),
                                getTutors(),
                                getAdmins()
                            ]);

                            console.log('Fetched data:', {
                                students: studentsData,
                                tutors: tutorsData,
                                admins: adminsData
                            });

                            setStudents(studentsData);
                            setTutors(tutorsData);
                            setAdmins(adminsData);
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        } finally {
                            setLoading(false);
                        }
                    };

                    fetchData();
                }}
            />
        }
    ];

    if (!user) {
        return null;
    }

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
                <Tabs defaultActiveKey="1" items={items} className={styles.tabs} />
            </div>
        </div>
    );
}
