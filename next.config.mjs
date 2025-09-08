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
};

export default nextConfig;
