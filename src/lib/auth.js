import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}

export function getTokenFromRequest(request) {
	const authHeader = request.headers.get('authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}

	// Also check cookies for web app
	const cookies = request.headers.get('cookie');
	if (cookies) {
		const tokenCookie = cookies
			.split(';')
			.find((c) => c.trim().startsWith('token='));
		if (tokenCookie) {
			return tokenCookie.split('=')[1];
		}
	}

	return null;
}
