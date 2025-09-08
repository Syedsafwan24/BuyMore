/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	typescript: {
		// Disable TypeScript checking during build
		ignoreBuildErrors: true,
	},
	eslint: {
		// Disable ESLint during builds
		ignoreDuringBuilds: true,
	},
	experimental: {
		// Force dynamic rendering for all pages
		appDir: true,
	},
};

export default nextConfig;
