'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, Button } from 'antd';
import type { Student } from '@/types';

// Add this to the component props
interface StudentTableProps {
    initialData: Student[];
}

export default function StudentTable({ initialData }: StudentTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Cell No.', dataIndex: 'cellNo', key: 'cellNo' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Country', dataIndex: 'country', key: 'country' },
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

    const handleSave = useCallback(async (values: any) => {
        console.log('Updated values:', values);
        setIsModalVisible(false);
        setSelectedStudent(null);
        form.resetFields();
    }, [form]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedStudent(null);
        form.resetFields();
    }, [form]);

    return (
        <div>
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
                title="Edit Student Information"
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
                    <Form.Item name="cellNo" label="Cell No." rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="city" label="City" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
