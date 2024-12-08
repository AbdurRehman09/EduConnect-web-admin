'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, message, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Student } from '@/types';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StudentTableProps {
    students: Student[];
    loading?: boolean;
    isEditable?: boolean;
    onDataChange?: () => void;
}

export default function StudentTable({ 
    students, 
    loading = false, 
    isEditable = false,
    onDataChange 
}: StudentTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        form.setFieldsValue(student);
        setIsModalVisible(true);
    };

    const handleDelete = async (student: Student) => {
        try {
            // Delete from Firestore first
            await deleteDoc(doc(db, 'students', student.id));
            message.success('Student deleted successfully');
            onDataChange?.();
        } catch (error: any) {
            console.error('Error deleting student:', error);
            message.error(error.message || 'Failed to delete student');
        }
    };

    const handleSave = async (values: any) => {
        try {
            setIsSubmitting(true);
            if (!selectedStudent) return;

            await updateDoc(doc(db, 'students', selectedStudent.id), {
                ...values,
                updatedAt: new Date().toISOString()
            });

            message.success('Student updated successfully');
            setIsModalVisible(false);
            form.resetFields();
            onDataChange?.();
        } catch (error) {
            console.error('Error updating student:', error);
            message.error('Failed to update student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { 
            title: 'Full Name', 
            dataIndex: 'fullName', 
            key: 'fullName',
            sorter: (a: Student, b: Student) => a.fullName.localeCompare(b.fullName)
        },
        { 
            title: 'Email', 
            dataIndex: 'email', 
            key: 'email' 
        },
        { 
            title: 'Phone Number', 
            dataIndex: 'phoneNumber', 
            key: 'phoneNumber' 
        },
        { 
            title: 'Category', 
            dataIndex: 'category', 
            key: 'category',
            filters: [
                { text: 'Undergraduate', value: 'Undergraduate' },
                { text: 'Graduate', value: 'Graduate' },
                { text: 'High School', value: 'High School' }
            ],
            onFilter: (value: string, record: Student) => record.category === value
        },
        { 
            title: 'City', 
            dataIndex: 'city', 
            key: 'city',
            sorter: (a: Student, b: Student) => a.city.localeCompare(b.city)
        },
        { 
            title: 'Country', 
            dataIndex: 'country', 
            key: 'country',
            sorter: (a: Student, b: Student) => a.country.localeCompare(b.country)
        },
        { 
            title: 'Institute', 
            dataIndex: 'institute', 
            key: 'institute' 
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a: Student, b: Student) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        },
        isEditable && {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Student) => (
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
    ].filter(Boolean);

    useEffect(() => {
        if (selectedStudent && isModalVisible) {
            form.setFieldsValue(selectedStudent);
        }
    }, [selectedStudent, isModalVisible, form]);

    const handleRowClick = useCallback((record: Student) => {
        setSelectedStudent(record);
        setIsModalVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedStudent(null);
        form.resetFields();
    }, [form]);

    console.log('StudentTable render:', { students, loading });

    return (
        <>
            <Table 
                dataSource={students} 
                columns={columns}
                loading={loading}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => {
                        if (isEditable) {
                            setSelectedStudent(record);
                            setIsModalVisible(true);
                        }
                    },
                    style: { cursor: isEditable ? 'pointer' : 'default' }
                })}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} students`
                }}
            />

            <Modal
                title="Edit Student"
                open={isModalVisible}
                onOk={form.submit}
                onCancel={handleCancel}
                confirmLoading={isSubmitting}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input student full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input student email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input student phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select student category!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please input student city!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[{ required: true, message: 'Please input student country!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="institute"
                        label="Institute"
                        rules={[{ required: true, message: 'Please input student institute!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
