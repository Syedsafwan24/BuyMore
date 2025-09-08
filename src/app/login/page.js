'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login, user } = useAuth();

	const redirectPath = searchParams.get('redirect') || '/';

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			router.push(redirectPath);
		}
	}, [user, router, redirectPath]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await login(email, password);
			// Redirect to specified path or home page
			router.push(redirectPath);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Sign in to your account
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Demo credentials: admin@example.com / password
					</p>
				</div>
				<Card className='p-8'>
					<form className='space-y-6' onSubmit={handleSubmit}>
						{error && (
							<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
								{error}
							</div>
						)}
						<div>
							<Label htmlFor='email'>Email address</Label>
							<Input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='mt-1'
								placeholder='Enter your email'
							/>
						</div>
						<div>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='mt-1'
								placeholder='Enter your password'
							/>
						</div>

						<div>
							<Button
								type='submit'
								disabled={loading}
								className='w-full flex justify-center py-2 px-4'
							>
								{loading ? 'Signing in...' : 'Sign in'}
							</Button>
						</div>

						<div className='text-center'>
							<span className='text-sm text-gray-600'>
								Don't have an account?{' '}
								<Link
									href='/signup'
									className='font-medium text-blue-600 hover:text-blue-500'
								>
									Sign up
								</Link>
							</span>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
}
