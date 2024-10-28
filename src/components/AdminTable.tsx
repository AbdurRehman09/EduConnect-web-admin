'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, Select, Button, message } from 'antd';
import type { Admin } from '@/types';

interface AdminTableProps {
    initialData: Admin[];
}

export default function AdminTable({ initialData }: AdminTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Last Login',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: (date: string) => new Date(date).toLocaleString()
        },
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
        console.log('Updated/Added values:', values);
        message.success(`Admin ${isAddMode ? 'added' : 'updated'} successfully`);
        setIsModalVisible(false);
        setSelectedAdmin(null);
        form.resetFields();
    }, [form, isAddMode]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedAdmin(null);
        form.resetFields();
    }, [form]);

    return (
        <div>
            <Button
                type="primary"
                onClick={handleAddNew}
                style={{ marginBottom: 16, backgroundColor: '#5C8307' }}
            >
                Add New Admin
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={initialData}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                rowClassName="cursor-pointer hover:bg-[#F9F1A5]"
            />

            <Modal
                title={isAddMode ? "Add New Admin" : "Edit Admin"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
                maskClosable={false}
            >
                <Form
                    form={form}
                    onFinish={handleSave}
                    layout="vertical"
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    {isAddMode && (
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, min: 6 }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="super_admin">Super Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isAddMode ? 'Add Admin' : 'Save Changes'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
