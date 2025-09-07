'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = 'info', duration = 3000) => {
		const id = Date.now() + Math.random();
		const toast = { id, message, type, duration };

		setToasts((prev) => [...prev, toast]);

		if (duration > 0) {
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, duration);
		}

		return id;
	}, []);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const success = useCallback(
		(message, duration) => addToast(message, 'success', duration),
		[addToast]
	);
	const error = useCallback(
		(message, duration) => addToast(message, 'error', duration),
		[addToast]
	);
	const info = useCallback(
		(message, duration) => addToast(message, 'info', duration),
		[addToast]
	);
	const loading = useCallback(
		(message) => addToast(message, 'loading', 0),
		[addToast]
	);

	return (
		<ToastContext.Provider
			value={{ addToast, removeToast, success, error, info, loading }}
		>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
};

const ToastContainer = ({ toasts, onRemove }) => {
	if (toasts.length === 0) return null;

	return (
		<div className='fixed top-4 right-4 z-50 space-y-2'>
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} onRemove={onRemove} />
			))}
		</div>
	);
};

const Toast = ({ id, message, type, onRemove }) => {
	const getIcon = () => {
		switch (type) {
			case 'success':
				return <CheckCircle className='w-5 h-5 text-green-600' />;
			case 'error':
				return <AlertCircle className='w-5 h-5 text-red-600' />;
			case 'loading':
				return <Loader className='w-5 h-5 text-blue-600 animate-spin' />;
			default:
				return <Info className='w-5 h-5 text-blue-600' />;
		}
	};

	const getBackgroundColor = () => {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200';
			case 'error':
				return 'bg-red-50 border-red-200';
			case 'loading':
				return 'bg-blue-50 border-blue-200';
			default:
				return 'bg-blue-50 border-blue-200';
		}
	};

	return (
		<div
			className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getBackgroundColor()}`}
		>
			{getIcon()}
			<span className='ml-3 text-sm font-medium text-gray-900 flex-1'>
				{message}
			</span>
			{type !== 'loading' && (
				<button
					onClick={() => onRemove(id)}
					className='ml-2 text-gray-400 hover:text-gray-600'
				>
					<X className='w-4 h-4' />
				</button>
			)}
		</div>
	);
};
