'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, Tag, Button, Select, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import type { Admin } from '@/types';
import { createUserWithEmailAndPassword, deleteUser, getAuth } from 'firebase/auth';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AdminTableProps {
    admins: Admin[];
    loading?: boolean;
    isEditable?: boolean;
    onDataChange?: () => void;
}

export default function AdminTable({ 
    admins, 
    loading = false,
    isEditable = false,
    onDataChange 
}: AdminTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);

    const handleAdd = () => {
        if (!isEditable) {
            message.error('You do not have permission to add admins');
            return;
        }
        setIsAddMode(true);
        setSelectedAdmin(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (admin: Admin) => {
        if (!isEditable) {
            message.error('You do not have permission to edit admins');
            return;
        }
        setIsAddMode(false);
        setSelectedAdmin(admin);
        form.setFieldsValue(admin);
        setIsModalVisible(true);
    };

    const handleDelete = async (admin: Admin) => {
        if (!isEditable) {
            message.error('You do not have permission to delete admins');
            return;
        }
        try {
            // Delete from Firestore first
            await deleteDoc(doc(db, 'admins', admin.id));
            message.success('Admin deleted successfully');
            onDataChange?.();
        } catch (error: any) {
            console.error('Error deleting admin:', error);
            message.error(error.message || 'Failed to delete admin');
        }
    };

    const handleSave = async (values: any) => {
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
                const adminData = {
                    name: values.name,
                    email: values.email,
                    role: values.role,
                    lastLogin: new Date().toISOString()
                };

                await setDoc(doc(db, 'admins', userCredential.user.uid), adminData);
                message.success('Admin added successfully');
            } else if (selectedAdmin) {
                // Update existing admin
                await updateDoc(doc(db, 'admins', selectedAdmin.id), {
                    ...values,
                    updatedAt: new Date().toISOString()
                });
                message.success('Admin updated successfully');
            }

            setIsModalVisible(false);
            form.resetFields();
            onDataChange?.();
        } catch (error: any) {
            console.error('Error saving admin:', error);
            message.error(error.message || 'Failed to save admin');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const columnsWithActions = isEditable ? [
        ...columns,
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Admin) => (
                <Space onClick={(e) => e.stopPropagation()}>
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    />
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            )
        }
    ] : columns;

    return (
        <div>
            {isEditable && (
                <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    onClick={handleAddNew}
                    style={{ marginBottom: 16 }}
                >
                    Add New Admin
                </Button>
            )}

            <Table
                dataSource={admins}
                columns={columnsWithActions}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => {
                        if (isEditable) {
                            setSelectedAdmin(record);
                            setIsModalVisible(true);
                        }
                    },
                    style: { cursor: isEditable ? 'pointer' : 'default' }
                })}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} admins`
                }}
            />

            <Modal
                title={isAddMode ? "Add New Admin" : "Admin Details"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setSelectedAdmin(null);
                    setIsAddMode(false);
                    form.resetFields();
                }}
                footer={isAddMode ? [
                    <Button key="cancel" onClick={() => {
                        setIsModalVisible(false);
                        setSelectedAdmin(null);
                        setIsAddMode(false);
                        form.resetFields();
                    }}>
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
