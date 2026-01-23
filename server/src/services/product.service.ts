import prisma from '../config/database';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors';
import { Product, ProductStatus, SyncStatus } from '@prisma/client';

export interface ProductFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  farmerId?: string;
  status?: ProductStatus;
  search?: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating';
}

export class ProductService {
  // Create product
  async createProduct(
    farmerId: string,
    data: {
      title: string;
      description?: string;
      category: string;
      price: number;
      quantity: number;
      minOrder?: number;
      unit?: string;
      images?: string[];
      location: string;
      latitude?: number;
      longitude?: number;
    }
  ): Promise<Product> {
    // Verify user is a farmer
    const user = await prisma.user.findUnique({
      where: { id: farmerId },
    });

    if (!user || user.role !== 'FARMER') {
      throw new AuthorizationError('Only farmers can create products');
    }

    return await prisma.product.create({
      data: {
        farmerId,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        minOrder: data.minOrder,
        unit: data.unit || 'kg',
        images: data.images || [],
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        status: ProductStatus.ACTIVE,
        syncStatus: SyncStatus.SYNCED,
      },
    });
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product & { farmer: any }> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        farmer: {
          include: {
            farmerProfile: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    // Increment view count
    await prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } },
    });

    return product;
  }

  // Get products with filters and pagination
  async getProducts(
    filters: ProductFilters = {},
    pagination: ProductPagination
  ): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 20, sortBy = 'newest' } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: filters.status || ProductStatus.ACTIVE,
    };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.minQuantity !== undefined) {
      where.quantity = { gte: filters.minQuantity };
    }

    if (filters.farmerId) {
      where.farmerId = filters.farmerId;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              farmerProfile: {
                select: {
                  verificationStatus: true,
                  rating: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  // Update product
  async updateProduct(
    productId: string,
    farmerId: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      price?: number;
      quantity?: number;
      minOrder?: number;
      unit?: string;
      images?: string[];
      location?: string;
      latitude?: number;
      longitude?: number;
      status?: ProductStatus;
    }
  ): Promise<Product> {
    const product = await this.getProductById(productId);

    if (product.farmerId !== farmerId) {
      throw new AuthorizationError('You can only update your own products');
    }

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.minOrder !== undefined) updateData.minOrder = data.minOrder;
    if (data.unit) updateData.unit = data.unit;
    if (data.images) updateData.images = data.images;
    if (data.location) updateData.location = data.location;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.status) updateData.status = data.status;

    return await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
  }

  // Delete product
  async deleteProduct(productId: string, farmerId: string): Promise<void> {
    const product = await this.getProductById(productId);

    if (product.farmerId !== farmerId) {
      throw new AuthorizationError('You can only delete your own products');
    }

    await prisma.product.update({
      where: { id: productId },
      data: { status: ProductStatus.DELETED },
    });
  }

  // Get farmer's products
  async getFarmerProducts(farmerId: string, status?: ProductStatus): Promise<Product[]> {
    const where: any = { farmerId };
    if (status) where.status = status;

    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get product categories
  async getCategories(): Promise<string[]> {
    const products = await prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      select: { category: true },
      distinct: ['category'],
    });

    return products.map((p) => p.category);
  }

  // Get locations
  async getLocations(): Promise<string[]> {
    const products = await prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      select: { location: true },
      distinct: ['location'],
    });

    return products.map((p) => p.location);
  }
}

export default new ProductService();
