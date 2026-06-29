import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma'; // Assumes Prisma setup

export class AuthService {
  public async generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    // Save to DB
    // await prisma.session.create({ data: { userId, refreshToken, expiresAt: new Date(Date.now() + 7*24*60*60*1000) }});
    
    return { accessToken, refreshToken };
  }

  public verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}
