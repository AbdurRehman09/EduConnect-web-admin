'use client';

import { useState } from 'react';
import { Table, Modal, Form, Input, Button } from 'antd';
import type { Student } from '@/types';

export default function StudentTable() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Cell No.', dataIndex: 'cellNo', key: 'cellNo' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Country', dataIndex: 'country', key: 'country' },
    ];

    const handleRowClick = (record: Student) => {
        setSelectedStudent(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleSave = async (values: any) => {
        console.log('Updated values:', values);
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={[]}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                rowClassName="cursor-pointer hover:bg-[#F9F1A5]"
            />

            <Modal
                title="Edit Student Information"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
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
        </>
    );
}
