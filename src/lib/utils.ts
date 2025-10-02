import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

export function generateToken(payload: any, secret: string): string {
  const token: string = jwt.sign(payload, secret, { expiresIn: '1d' });
  return token;
}

export async function verifyToken(token: string) {
  if (!token) {
    return {
      valid: false,
      error: 'No token provided',
    };
  }

  try {
    // Verify the token
    const payload = await jwt.verify(token, process.env.JWT_SECRET!);

    return {
      valid: true,
      payload,
    };
  } catch (error) {
    // Detailed error handling
    console.log('ERROR: ', error);
    switch (error.name) {
      case 'TokenExpiredError':
        return {
          valid: false,
          error: 'Token has expired',
        };

      case 'JsonWebTokenError':
        return {
          valid: false,
          error: 'Invalid token signature',
        };

      case 'NotBeforeError':
        return {
          valid: false,
          error: 'Token not yet active',
        };

      default:
        return {
          valid: false,
          error: 'Token verification failed',
        };
    }
  }
}

export function generateRandomToken() {
  return crypto.randomBytes(6).toString('hex'); // Generate a 256-bit random token
}

