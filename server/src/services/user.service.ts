import prisma from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';
import { User, UserRole, VerificationStatus } from '@prisma/client';

export class UserService {
  // Get user by ID
  async getUserById(userId: string): Promise<User & { farmerProfile?: any; buyerProfile?: any }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        buyerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  // Get user by phone number
  async getUserByPhone(phoneNumber: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  // Update user profile
  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      language?: string;
      avatar?: string;
      role?: UserRole; // Allow role update during profile setup
    }
  ): Promise<User> {
    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ValidationError('Email already in use');
      }

      updateData.email = data.email;
    }
    if (data.language) {
      updateData.language =
        data.language === 'amharic' ? 'AMHARIC' : data.language === 'oromo' ? 'OROMO' : 'ENGLISH';
    }
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.role) updateData.role = data.role; // Update role if provided

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // Update farmer profile
  async updateFarmerProfile(
    userId: string,
    data: {
      farmName?: string;
      farmLocation?: string;
      latitude?: number;
      longitude?: number;
    }
  ): Promise<any> {
    const user = await this.getUserById(userId);

    if (user.role !== UserRole.FARMER) {
      throw new ValidationError('User is not a farmer');
    }

    const updateData: any = {};
    if (data.farmName) updateData.farmName = data.farmName;
    if (data.farmLocation) updateData.farmLocation = data.farmLocation;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;

    // Create farmer profile if it doesn't exist yet (first-time setup), otherwise update
    return await prisma.farmerProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        farmName: data.farmName,
        farmLocation: data.farmLocation,
        latitude: data.latitude,
        longitude: data.longitude,
        // Required fields without defaults
        verificationDocuments: [],
      },
    });
  }

  // Submit farmer verification documents
  async submitVerificationDocuments(
    userId: string,
    documents: string[]
  ): Promise<any> {
    const user = await this.getUserById(userId);

    if (user.role !== UserRole.FARMER) {
      throw new ValidationError('User is not a farmer');
    }

    return await prisma.farmerProfile.update({
      where: { userId },
      data: {
        verificationDocuments: documents,
        verificationStatus: VerificationStatus.UNDER_REVIEW,
      },
    });
  }

  // Admin: Verify farmer
  async verifyFarmer(farmerId: string, adminId: string): Promise<any> {
    // Verify admin
    const admin = await this.getUserById(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new ValidationError('Only admins can verify farmers');
    }

    const farmer = await this.getUserById(farmerId);
    if (farmer.role !== UserRole.FARMER) {
      throw new ValidationError('User is not a farmer');
    }

    return await prisma.farmerProfile.update({
      where: { userId: farmerId },
      data: {
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });
  }

  // Admin: Reject farmer verification
  async rejectFarmerVerification(farmerId: string, adminId: string, reason?: string): Promise<any> {
    const admin = await this.getUserById(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new ValidationError('Only admins can reject verification');
    }

    return await prisma.farmerProfile.update({
      where: { userId: farmerId },
      data: {
        verificationStatus: VerificationStatus.REJECTED,
      },
    });
  }

  // Update buyer profile
  async updateBuyerProfile(
    userId: string,
    data: {
      businessName?: string;
      businessType?: string;
      address?: string;
    }
  ): Promise<any> {
    const user = await this.getUserById(userId);

    if (user.role !== UserRole.BUYER) {
      throw new ValidationError('User is not a buyer');
    }

    const updateData: any = {};
    if (data.businessName) updateData.businessName = data.businessName;
    if (data.businessType) updateData.businessType = data.businessType;
    if (data.address) updateData.address = data.address;

    // Create buyer profile if it doesn't exist yet (first-time setup), otherwise update
    return await prisma.buyerProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        businessName: data.businessName,
        businessType: data.businessType,
        address: data.address,
      },
    });
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<any> {
    const user = await this.getUserById(userId);

    if (user.role === UserRole.FARMER) {
      const [totalProducts, totalOrders, totalRevenue] = await Promise.all([
        prisma.product.count({ where: { farmerId: userId } }),
        prisma.order.count({ where: { farmerId: userId } }),
        prisma.payment.aggregate({
          where: {
            order: { farmerId: userId },
            status: 'COMPLETED',
            escrowStatus: 'RELEASED',
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
      };
    } else if (user.role === UserRole.BUYER) {
      const [totalOrders, totalSpent] = await Promise.all([
        prisma.order.count({ where: { buyerId: userId } }),
        prisma.payment.aggregate({
          where: {
            order: { buyerId: userId },
            status: 'COMPLETED',
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        totalOrders,
        totalSpent: totalSpent._sum.amount || 0,
      };
    }

    return {};
  }
}

export default new UserService();
