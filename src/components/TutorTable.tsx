'use client';

import { useState } from 'react';
import { Table, Modal, Form, Input, Select, Button } from 'antd';
import type { Tutor } from '@/types';

export default function TutorTable() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Experience Level', dataIndex: 'experienceLevel', key: 'experienceLevel' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Country', dataIndex: 'country', key: 'country' },
    ];

    const handleRowClick = (record: Tutor) => {
        setSelectedTutor(record);
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
                title="Edit Tutor Information"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="experienceLevel" label="Experience Level" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="beginner">Beginner</Select.Option>
                            <Select.Option value="intermediate">Intermediate</Select.Option>
                            <Select.Option value="advanced">Advanced</Select.Option>
                        </Select>
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
