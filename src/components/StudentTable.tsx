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
        {
            title: 'Tutoring Requests',
            dataIndex: 'tutoringRequests',
            key: 'tutoringRequests',
            render: (requests: any[]) => (
                <div>
                    {requests.map((request, index) => (
                        <div key={index} className="mb-2 p-2 bg-[#FFFFE0] rounded">
                            <div><strong>Subject:</strong> {request.subject}</div>
                            <div><strong>Hours:</strong> {request.hours}</div>
                            <div><strong>Fees:</strong> ${request.fees}</div>
                            <div><strong>Description:</strong> {request.description}</div>
                        </div>
                    ))}
                </div>
            ),
        },
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
                width={800}
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

                    {/* Add Form List for Tutoring Requests */}
                    <Form.List name="tutoringRequests">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="p-4 border rounded mb-4 bg-[#FFFFE0]">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'subject']}
                                            label="Subject"
                                            rules={[{ required: true }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'hours']}
                                            label="Hours"
                                            rules={[{ required: true }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'fees']}
                                            label="Fees"
                                            rules={[{ required: true }]}
                                        >
                                            <Input type="number" prefix="$" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            label="Description"
                                            rules={[{ required: true }]}
                                        >
                                            <Input.TextArea />
                                        </Form.Item>
                                        <Button type="dashed" onClick={() => remove(name)} danger>
                                            Remove Request
                                        </Button>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Tutoring Request
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

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
