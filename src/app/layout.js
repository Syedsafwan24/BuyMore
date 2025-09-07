import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SidebarLayout from '@/components/layout/sidebar-layout';
import { CartProvider } from '@/hooks/useCart';
import { ToastProvider } from '@/components/ui/toast';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'BuyMore - E-commerce Store',
	description: 'Your one-stop shop for all your needs',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ToastProvider>
					<CartProvider>
						<SidebarLayout>{children}</SidebarLayout>
					</CartProvider>
				</ToastProvider>
			</body>
		</html>
	);
}
