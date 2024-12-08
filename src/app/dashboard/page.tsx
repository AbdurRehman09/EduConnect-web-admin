'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, Dropdown, Space } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, TeamOutlined, CrownOutlined, DownOutlined } from '@ant-design/icons';
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
    const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
    const router = useRouter();
    const { logout, user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log('No user found, redirecting to login');
            router.push('/');
            return;
        }

        console.log('Current user:', user);

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

                // Find current admin
                const currentAdminData = adminsData.find(admin => admin.email === user.email);
                if (!currentAdminData) {
                    console.error('Current user is not an admin');
                    await logout();
                    router.push('/');
                    return;
                }

                setCurrentAdmin(currentAdminData);
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
    }, [user, router, logout]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const userMenuItems = [
        {
            key: 'name',
            label: (
                <div className={styles.menuItem}>
                    <UserOutlined className={styles.menuIcon} />
                    <span className={styles.menuText}>{currentAdmin?.name || 'user'}</span>
                </div>
            ),
        },
        {
            key: 'email',
            label: (
                <div className={styles.menuItem}>
                    <span className={styles.menuEmail}>{user?.email || 'user@gmail.com'}</span>
                </div>
            ),
        },
        {
            key: 'role',
            label: (
                <div className={styles.menuItem}>
                    <CrownOutlined className={styles.menuIcon} />
                    <span className={styles.menuRole}>{currentAdmin?.role?.toUpperCase() || 'ADMIN'}</span>
                </div>
            ),
        },
        {
            key: 'logout',
            label: (
                <div className={styles.menuItem}>
                    <LogoutOutlined className={styles.logoutIcon} />
                    <span className={styles.logoutText}>Logout</span>
                </div>
            ),
            onClick: handleLogout,
        },
    ];

    const handleDataRefresh = async () => {
        const [studentsData, tutorsData, adminsData] = await Promise.all([
            getStudents(),
            getTutors(),
            getAdmins()
        ]);

        setStudents(studentsData);
        setTutors(tutorsData);
        setAdmins(adminsData);
    };

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <UserOutlined />
                    Students ({students.length})
                </span>
            ),
            children: <StudentTable 
                students={students} 
                loading={loading}
                isEditable={true} // All admins can edit students
                onDataChange={handleDataRefresh}
            />
        },
        {
            key: '2',
            label: (
                <span>
                    <TeamOutlined />
                    Tutors ({tutors.length})
                </span>
            ),
            children: <TutorTable 
                tutors={tutors} 
                loading={loading}
                isEditable={true} // All admins can edit tutors
                onDataChange={handleDataRefresh}
            />
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
                isEditable={currentAdmin?.role === 'super_admin'} // Only super_admin can edit admins
                onDataChange={handleDataRefresh}
            />
        }
    ];

    if (!user || !currentAdmin) {
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
                <div className={styles.userSection}>
                    <Dropdown 
                        menu={{ 
                            items: userMenuItems,
                            className: styles.dropdownMenu
                        }} 
                        trigger={['hover']}
                        placement="bottomRight"
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space className={styles.userInfo}>
                                <UserOutlined />
                                <span>{currentAdmin.name}</span>
                                <DownOutlined className={styles.dropdownArrow} />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
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
