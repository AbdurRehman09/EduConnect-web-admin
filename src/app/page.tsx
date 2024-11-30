'use client';

import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AntdProvider';
import Image from 'next/image';
import loginIllustration from '../../public/login-illustration.png';

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
    <div className="h-screen bg-[#D4E2B6] flex flex-col">
      {/* Header */}
      <div className="bg-[#5C8307] py-3">
        <h1 className="text-xl font-bold px-4">EduConnect</h1>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[360px] bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="h-[180px] relative bg-[#D4E2B6] flex justify-center items-center">
            <Image
              src={loginIllustration}
              alt="Education Illustration"
              width={350}
              height={150}
              className="object-contain"
              style={{marginLeft:"530px"}}
              priority
            />
          </div>

          {/* Form Section */}
          <div className="px-6 py-5">
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              style={{width:"350px",margin:"auto"}}
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
                  className="h-10 rounded-lg bg-white"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                className="mb-1"
              >
                <Input.Password
                  placeholder="Password"
                  className="h-10 rounded-lg bg-white"
                />
              </Form.Item>

              <div className="flex justify-end mb-4">
                <a
                  href="#"
                  className="text-[#5C8307] hover:text-[#4a6906] text-sm"
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
                className="h-10 rounded-lg mb-3"
                style={{
                  backgroundColor: '#5C8307',
                  borderColor: '#5C8307'
                }}
              >
                LOG IN
              </Button>

              <div className="text-center text-gray-600 text-sm">
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
