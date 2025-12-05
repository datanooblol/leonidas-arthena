'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Atom } from 'lucide-react';
import { Button, Input } from '../atoms'; 
import { AuthTemplate } from '../templates/AuthTemplate';

export const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    // ใน App จริง ตรงนี้คือ Logic ยิง API Login
    router.push('/dashboard');
  };

  return (
    <AuthTemplate>
      <div className="bg-bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8 space-y-2">
          {/* ปรับเป็น bg-gradient-to-tr ตามมาตรฐาน Tailwind */}
          <div className="bg-linear-to-tr from-blue-500 to-purple-500 p-3 rounded-xl mb-2 shadow-lg">
             <Atom className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-text-main">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-text-secondary text-sm text-center">
            {isLogin ? 'Enter your credentials to access your workspace' : 'Get started with your AI research assistant'}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
          {!isLogin && <Input placeholder="Full Name" icon={Sparkles} />}
          <Input placeholder="name@example.com" type="email" />
          <Input placeholder="••••••••" type="password" />
          
          <Button fullWidth size="lg" type="submit" className="mt-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Footer Toggle */}
        <p className="mt-6 text-center text-xs text-text-secondary">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium focus:outline-none cursor-pointer"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </AuthTemplate>
  );
};