'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, Spin } from 'antd';
import type { Student } from '@/types';

interface StudentTableProps {
    students: Student[];
    loading?: boolean;
}

export default function StudentTable({ students, loading = false }: StudentTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form] = Form.useForm();

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
        }
    ];

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
        <div>
            <Table
                dataSource={students}
                columns={columns}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record)
                })}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} students`
                }}
            />

            <Modal
                title="Student Details"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Full Name" name="fullName">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phoneNumber">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="City" name="city">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Country" name="country">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label="Institute" name="institute">
                        <Input readOnly />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
