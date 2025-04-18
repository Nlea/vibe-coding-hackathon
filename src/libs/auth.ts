import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
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
    return await verify(token, JWT_SECRET) as AuthUser;
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
