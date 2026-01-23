import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  minOrder: z.number().positive().optional(),
  unit: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const updateProductSchema = createProductSchema.partial();

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.string().transform(Number).pipe(z.number().nonnegative()).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().nonnegative()).optional(),
  minQuantity: z.string().transform(Number).pipe(z.number().nonnegative()).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['newest', 'price-low', 'price-high', 'rating']).optional(),
});

export class ProductController {
  // Create product
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = createProductSchema.parse(req.body);
      const product = await productService.createProduct(req.user.id, data);
      return sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get products
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const query = querySchema.parse(req.query);
      const filters = {
        category: query.category,
        location: query.location,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        minQuantity: query.minQuantity,
        search: query.search,
      };
      const { products, total } = await productService.getProducts(filters, {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
      });
      return sendPaginated(res, products, { page: query.page, limit: query.limit, total }, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get product by ID
  async getProductById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      return sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update product
  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const data = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(id, req.user.id, data);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete product
  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      await productService.deleteProduct(id, req.user.id);
      return sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get farmer products
  async getFarmerProducts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const products = await productService.getFarmerProducts(req.user.id);
      return sendSuccess(res, products, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get categories
  async getCategories(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const categories = await productService.getCategories();
      return sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get locations
  async getLocations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const locations = await productService.getLocations();
      return sendSuccess(res, locations, 'Locations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
