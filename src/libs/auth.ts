import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function sha256(message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return crypto.subtle.digest('SHA-256', data);
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltBase64 = bufferToBase64(salt.buffer);
  const hash = await sha256(password + saltBase64);
  const hashBase64 = bufferToBase64(hash);
  return `${saltBase64}:${hashBase64}`;
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) return false;
  
  const newHash = await sha256(password + salt);
  const newHashBase64 = bufferToBase64(newHash);
  return newHashBase64 === hash;
}

export async function generateJWT(user: AuthUser): Promise<string> {
  return sign({
    id: user.id,
    email: user.email,
    name: user.name
  }, JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<AuthUser> {
  try {
    const payload = await verify(token, JWT_SECRET);
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new Error('Invalid token payload');
    }
    return {
      id: Number(payload.id),
      email: String(payload.email),
      name: String(payload.name)
    };
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' });
  }
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = await verifyJWT(token);
    c.set('user', user);
    await next();
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' });
  }
}
