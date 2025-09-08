export function getBaseUrl() {
	// For server-side rendering
	if (typeof window === 'undefined') {
		// Check if we're in Vercel
		if (process.env.VERCEL_URL) {
			return `https://${process.env.VERCEL_URL}`;
		}
		// Check if we have a custom NEXTAUTH_URL
		if (process.env.NEXTAUTH_URL) {
			return process.env.NEXTAUTH_URL;
		}
		// Fallback to localhost
		return 'http://localhost:3000';
	}

	// For client-side rendering
	return window.location.origin;
}

export function getAuthUrl(path = '') {
	return `${getBaseUrl()}${path}`;
}
