'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
	const [status, setStatus] = useState('');

	const clearCookies = async () => {
		try {
			const response = await fetch('/api/auth/clear', {
				method: 'POST',
				credentials: 'include',
			});
			if (response.ok) {
				setStatus('Cookies cleared successfully');
				window.location.reload();
			} else {
				setStatus('Failed to clear cookies');
			}
		} catch (error) {
			setStatus('Error: ' + error.message);
		}
	};

	const testAuth = async () => {
		try {
			const response = await fetch('/api/auth/me', {
				credentials: 'include',
			});
			const data = await response.json();
			setStatus(`Auth test: ${response.status} - ${JSON.stringify(data)}`);
		} catch (error) {
			setStatus('Auth test error: ' + error.message);
		}
	};

	const testLogin = async () => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					email: 'user@example.com',
					password: 'password',
				}),
			});
			const data = await response.json();
			setStatus(`Login test: ${response.status} - ${JSON.stringify(data)}`);
		} catch (error) {
			setStatus('Login test error: ' + error.message);
		}
	};

	return (
		<div className='p-8 max-w-md mx-auto'>
			<h1 className='text-2xl font-bold mb-4'>Debug Page</h1>

			<div className='space-y-4'>
				<Button onClick={clearCookies} className='w-full'>
					Clear All Cookies
				</Button>

				<Button onClick={testAuth} className='w-full'>
					Test Auth Status
				</Button>

				<Button onClick={testLogin} className='w-full'>
					Test Login (user@example.com)
				</Button>
			</div>

			{status && (
				<div className='mt-4 p-4 bg-gray-100 rounded'>
					<pre className='text-xs'>{status}</pre>
				</div>
			)}

			<div className='mt-8 text-sm text-gray-600'>
				<p>
					<strong>Test credentials:</strong>
				</p>
				<p>Email: user@example.com</p>
				<p>Password: password</p>
			</div>
		</div>
	);
}
