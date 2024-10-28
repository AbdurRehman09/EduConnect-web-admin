'use client';

import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AntdProvider';
import Image from 'next/image';
import loginIllustration from '../../public/login-illustration.jpeg';

interface LoginForm {
  email: string;
  password: string;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@educonnect.com',
  password: 'admin123'
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      if (values.email === ADMIN_CREDENTIALS.email && values.password === ADMIN_CREDENTIALS.password) {
        document.cookie = 'auth=true; path=/';
        login();
        message.success('Login successful');
        router.push('/dashboard');
      } else {
        message.error('Invalid credentials');
      }
    } catch (error) {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4E2B6]">
      {/* Header */}
      <div className="bg-[#5C8307] p-4">
        <h1 className="text-2xl text-white font-bold">EduConnect</h1>
      </div>

      {/* Main Container */}
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="w-[400px] bg-white rounded-3xl overflow-hidden">
          {/* Image Section - Fixed height */}
          <div className="h-[250px] bg-[#D4E2B6]">
            <Image
              src={loginIllustration}
              alt="Education Illustration"
            // fill
            // style={{ objectFit: 'fill' }}
            />
          </div>

          {/* Form Section - Same width as image */}
          <div className="p-8">
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  placeholder="Email"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                className="mb-2"
              >
                <Input.Password
                  placeholder="Password"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <div className="flex justify-end mb-6">
                <a
                  href="#"
                  className="text-[#5C8307] hover:text-[#4a6906]"
                  onClick={(e) => {
                    e.preventDefault();
                    message.info('Password reset functionality coming soon');
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="h-12 rounded-lg mb-4"
                style={{
                  backgroundColor: '#5C8307',
                  borderColor: '#5C8307'
                }}
              >
                LOG IN
              </Button>

              <div className="text-center text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="text-[#5C8307] hover:text-[#4a6906]">
                  Sign Up
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
