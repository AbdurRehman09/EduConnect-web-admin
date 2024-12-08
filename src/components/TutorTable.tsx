'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, Modal, Form, Input, Button } from 'antd';
import type { Tutor } from '@/types';

interface TutorTableProps {
    tutors: Tutor[];
    loading?: boolean;
}

export default function TutorTable({ tutors, loading = false }: TutorTableProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [form] = Form.useForm();

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
        }
    ];

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
                    onClick: () => handleRowClick(record)
                })}
                pagination={{
                    defaultPageSize: 10,
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
        </div>
    );
}
