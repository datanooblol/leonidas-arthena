'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button, Input } from '../atoms'; 
import { AuthTemplate } from '../templates/AuthTemplate';
import { userService } from '@/lib/services/user';
import Image from 'next/image';

export const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = isLogin 
        ? await userService.login({ email, password })
        : await userService.register({ email, password });
      
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_id', response.user_id);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate>
      <div className="bg-bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className=" rounded-xl mb-2">
             <Image 
              src="/leonidasArthenaLogo.png" 
              alt="Leonidas Arthena Logo" 
              width={80} // w-20 ประมาณ 80px
              height={80}
              className="w-20 h-20 object-contain drop-shadow-md" 
              priority // โหลดทันทีเพราะเป็น LCP
            />
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
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {!isLogin && <Input placeholder="Full Name" icon={Sparkles} value={name} onChange={(e) => setName(e.target.value)} />}
          <Input placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <Button fullWidth size="lg" type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
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