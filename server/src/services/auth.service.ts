import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { config } from '../config/env';
import { AuthenticationError, ValidationError, ConflictError } from '../utils/errors';
import { User, UserRole, OtpPurpose } from '@prisma/client';
import { JWTPayload } from '../middleware/auth';
import logger from '../utils/logger';

export class AuthService {
  // Generate OTP
  async generateOTP(phoneNumber: string, purpose: OtpPurpose): Promise<string> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + config.sms.otpExpiresIn);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    // Save OTP
    await prisma.otpCode.create({
      data: {
        phoneNumber,
        code,
        purpose,
        expiresAt,
        userId: user?.id,
      },
    });

    // TODO: Send OTP via SMS service
    logger.info(`OTP generated for ${phoneNumber}: ${code} (Purpose: ${purpose})`);

    return code;
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, code: string, purpose: OtpPurpose): Promise<User> {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phoneNumber,
        code,
        purpose,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new AuthenticationError('Invalid or expired OTP');
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user && purpose === OtpPurpose.REGISTRATION) {
      // Create new user during registration
      user = await prisma.user.create({
        data: {
          phoneNumber,
          firstName: '', // Will be updated in profile
          lastName: '',
          isVerified: true,
        },
      });
    }

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return user;
  }

  // Register user
  async register(data: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
    role?: UserRole;
    language?: string;
  }): Promise<User> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingUser) {
      throw new ConflictError('User already exists with this phone number');
    }

    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new ConflictError('User already exists with this email');
      }
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        phoneNumber: data.phoneNumber,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || UserRole.BUYER,
        language: data.language === 'amharic' ? 'AMHARIC' : data.language === 'oromo' ? 'OROMO' : 'ENGLISH',
        isVerified: true,
      },
    });

    // Create profile based on role
    if (user.role === UserRole.FARMER) {
      await prisma.farmerProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else if (user.role === UserRole.BUYER) {
      await prisma.buyerProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  }

  // Login with phone and password
  async login(phoneNumber: string, password: string): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new AuthenticationError('Password not set. Please use OTP login.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is inactive');
    }

    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  // Generate JWT tokens
  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JWTPayload = {
      id: user.id,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;

      // Verify refresh token exists in database
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new AuthenticationError('Invalid or expired refresh token');
      }

      const user = tokenRecord.user;

      if (!user.isActive) {
        throw new AuthenticationError('Account is inactive');
      }

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });

      // Generate new tokens
      return await this.generateTokens(user);
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  // Logout
  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // Change password
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      throw new AuthenticationError('Password not set');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new AuthenticationError('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  // Reset password
  async resetPassword(phoneNumber: string, otp: string, newPassword: string): Promise<void> {
    // Verify OTP
    await this.verifyOTP(phoneNumber, otp, OtpPurpose.PASSWORD_RESET);

    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
  }
}

export default new AuthService();
