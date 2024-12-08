'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, message, Button, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Tutor } from '@/types';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TutorTableProps {
    tutors: Tutor[];
    loading?: boolean;
    isEditable?: boolean;
    onDataChange?: () => void;
}

export default function TutorTable({ 
    tutors, 
    loading = false,
    isEditable = false,
    onDataChange 
}: TutorTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        form.setFieldsValue(tutor);
        setIsModalVisible(true);
    };

    const handleDelete = async (tutor: Tutor) => {
        try {
            // Delete from Firestore first
            await deleteDoc(doc(db, 'tutors', tutor.id));
            message.success('Tutor deleted successfully');
            onDataChange?.();
        } catch (error: any) {
            console.error('Error deleting tutor:', error);
            message.error(error.message || 'Failed to delete tutor');
        }
    };

    const handleSave = async (values: any) => {
        try {
            setIsSubmitting(true);
            if (!selectedTutor) return;

            await updateDoc(doc(db, 'tutors', selectedTutor.id), {
                ...values,
                updatedAt: new Date().toISOString()
            });

            message.success('Tutor updated successfully');
            setIsModalVisible(false);
            form.resetFields();
            onDataChange?.();
        } catch (error) {
            console.error('Error updating tutor:', error);
            message.error('Failed to update tutor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { 
            title: 'Full Name', 
            dataIndex: 'fullName', 
            key: 'fullName',
            sorter: (a: Tutor, b: Tutor) => a.fullName.localeCompare(b.fullName)
        },
        { 
            title: 'Phone Number', 
            dataIndex: 'phoneNumber', 
            key: 'phoneNumber' 
        },
        { 
            title: 'City', 
            dataIndex: 'city', 
            key: 'city',
            sorter: (a: Tutor, b: Tutor) => a.city.localeCompare(b.city)
        },
        { 
            title: 'Country', 
            dataIndex: 'country', 
            key: 'country',
            sorter: (a: Tutor, b: Tutor) => a.country.localeCompare(b.country)
        },
        { 
            title: 'Expertise 1', 
            dataIndex: 'expertise1', 
            key: 'expertise1',
            filters: [
                { text: 'Mathematics', value: 'Mathematics' },
                { text: 'Physics', value: 'Physics' },
                { text: 'Chemistry', value: 'Chemistry' },
                { text: 'Biology', value: 'Biology' }
            ],
            onFilter: (value: string, record: Tutor) => record.expertise1 === value
        },
        { 
            title: 'Expertise 2', 
            dataIndex: 'expertise2', 
            key: 'expertise2' 
        },
        { 
            title: 'Expertise 3', 
            dataIndex: 'expertise3', 
            key: 'expertise3' 
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a: Tutor, b: Tutor) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        },
        isEditable && {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Tutor) => (
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
        if (selectedTutor && isModalVisible) {
            form.setFieldsValue(selectedTutor);
        }
    }, [selectedTutor, isModalVisible, form]);

    const handleRowClick = useCallback((record: Tutor) => {
        setSelectedTutor(record);
        setIsModalVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedTutor(null);
        form.resetFields();
    }, [form]);

    console.log('TutorTable render:', { tutors, loading });

    return (
        <div>
            <Table
                dataSource={tutors}
                columns={columns}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => {
                        if (isEditable) {
                            setSelectedTutor(record);
                            setIsModalVisible(true);
                        }
                    },
                    style: { cursor: isEditable ? 'pointer' : 'default' }
                })}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} tutors`
                }}
            />

            <Modal
                title="Tutor Details"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Full Name" name="fullName">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phoneNumber">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="City" name="city">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Country" name="country">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Expertise 1" name="expertise1">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Expertise 2" name="expertise2">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Expertise 3" name="expertise3">
                        <Input readOnly />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Tutor"
                open={isModalVisible}
                onOk={form.submit}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
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
                        rules={[{ required: true, message: 'Please input tutor full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input tutor phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please input tutor city!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[{ required: true, message: 'Please input tutor country!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="expertise1"
                        label="Expertise 1"
                        rules={[{ required: true, message: 'Please input tutor expertise 1!' }]}
                    >
                        <Select>
                            <Select.Option value="Mathematics">Mathematics</Select.Option>
                            <Select.Option value="Physics">Physics</Select.Option>
                            <Select.Option value="Chemistry">Chemistry</Select.Option>
                            <Select.Option value="Biology">Biology</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="expertise2"
                        label="Expertise 2"
                        rules={[{ required: true, message: 'Please input tutor expertise 2!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="expertise3"
                        label="Expertise 3"
                        rules={[{ required: true, message: 'Please input tutor expertise 3!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
