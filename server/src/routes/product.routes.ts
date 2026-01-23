import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', optionalAuth, productController.getProducts.bind(productController));
router.get('/categories', productController.getCategories.bind(productController));
router.get('/locations', productController.getLocations.bind(productController));
router.get('/:id', optionalAuth, productController.getProductById.bind(productController));

// Protected routes (require authentication)
router.use(authenticate);

// Farmer routes
router.post('/', authorize(UserRole.FARMER), productController.createProduct.bind(productController));
router.get('/farmer/my-products', authorize(UserRole.FARMER), productController.getFarmerProducts.bind(productController));
router.put('/:id', authorize(UserRole.FARMER), productController.updateProduct.bind(productController));
router.delete('/:id', authorize(UserRole.FARMER), productController.deleteProduct.bind(productController));

export default router;
