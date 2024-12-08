'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, Tag, Button, Select, message } from 'antd';
import type { Admin } from '@/types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AdminTableProps {
    admins: Admin[];
    loading?: boolean;
    onAdminAdded?: () => void;
}

export default function AdminTable({ admins, loading = false, onAdminAdded }: AdminTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { 
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            sorter: (a: Admin, b: Admin) => a.name.localeCompare(b.name)
        },
        { 
            title: 'Email', 
            dataIndex: 'email', 
            key: 'email' 
        },
        { 
            title: 'Role', 
            dataIndex: 'role', 
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'super_admin' ? 'gold' : 'blue'}>
                    {role.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Super Admin', value: 'super_admin' }
            ],
            onFilter: (value: string, record: Admin) => record.role === value
        },
        {
            title: 'Last Login',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a: Admin, b: Admin) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
        }
    ];

    useEffect(() => {
        if (selectedAdmin && isModalVisible && !isAddMode) {
            form.setFieldsValue(selectedAdmin);
        }
    }, [selectedAdmin, isModalVisible, form, isAddMode]);

    const handleRowClick = useCallback((record: Admin) => {
        setIsAddMode(false);
        setSelectedAdmin(record);
        setIsModalVisible(true);
    }, []);

    const handleAddNew = () => {
        setIsAddMode(true);
        setSelectedAdmin(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleSave = useCallback(async (values: any) => {
        try {
            setIsSubmitting(true);
            if (isAddMode) {
                // Create authentication user
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );

                // Create admin document in Firestore
                const adminData: Omit<Admin, 'id'> = {
                    name: values.name,
                    email: values.email,
                    role: values.role,
                    lastLogin: new Date().toISOString()
                };

                await setDoc(doc(db, 'admins', userCredential.user.uid), adminData);

                message.success('Admin added successfully');
                onAdminAdded?.(); // Refresh the admin list
            } else {
                // Handle admin update if needed
                console.log('Updated values:', values);
                message.success('Admin updated successfully');
            }

            setIsModalVisible(false);
            setSelectedAdmin(null);
            form.resetFields();
        } catch (error: any) {
            console.error('Error saving admin:', error);
            message.error(error.message || 'Failed to save admin');
        } finally {
            setIsSubmitting(false);
        }
    }, [form, isAddMode, onAdminAdded]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedAdmin(null);
        setIsAddMode(false);
        form.resetFields();
    }, [form]);

    console.log('AdminTable render:', { admins, loading });

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    onClick={handleAddNew}
                    style={{ backgroundColor: '#5C8307' }}
                    icon={<span className="anticon">+</span>}
                >
                    Add New Admin
                </Button>
            </div>

            <Table
                dataSource={admins}
                columns={columns}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record)
                })}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} admins`
                }}
            />

            <Modal
                title={isAddMode ? "Add New Admin" : "Admin Details"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={isAddMode ? [
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        style={{ backgroundColor: '#5C8307' }}
                        loading={isSubmitting}
                    >
                        {isAddMode ? 'Add Admin' : 'Save Changes'}
                    </Button>
                ] : null}
            >
                <Form 
                    form={form} 
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item 
                        label="Name" 
                        name="name"
                        rules={isAddMode ? [{ required: true, message: 'Please enter name' }] : undefined}
                    >
                        <Input readOnly={!isAddMode} />
                    </Form.Item>
                    <Form.Item 
                        label="Email" 
                        name="email"
                        rules={isAddMode ? [
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ] : undefined}
                    >
                        <Input readOnly={!isAddMode} />
                    </Form.Item>
                    {isAddMode && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item 
                        label="Role" 
                        name="role"
                        rules={isAddMode ? [{ required: true, message: 'Please select role' }] : undefined}
                    >
                        {isAddMode ? (
                            <Select>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="super_admin">Super Admin</Select.Option>
                            </Select>
                        ) : (
                            <Input readOnly />
                        )}
                    </Form.Item>
                    {!isAddMode && (
                        <Form.Item label="Last Login" name="lastLogin">
                            <Input readOnly />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
}
