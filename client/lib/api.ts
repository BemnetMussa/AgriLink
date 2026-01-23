import Cookies from 'js-cookie';
import { extractErrorMessage } from '../utils/errorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private serverOnline: boolean | null = null;
  private lastServerCheck: number = 0;
  private readonly SERVER_CHECK_INTERVAL = 10000; // Check every 10 seconds

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      // Check cookie first, then localStorage
      this.token = Cookies.get('accessToken') || localStorage.getItem('accessToken') || null;
      // Sync cookie to localStorage if cookie exists but localStorage doesn't
      if (this.token && !localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', this.token);
      }
      // Check server status on initialization
      this.checkServerStatus();
    }
  }

  private async checkServerStatus(): Promise<boolean> {
    const now = Date.now();
    // Only check if enough time has passed since last check
    if (this.serverOnline !== null && (now - this.lastServerCheck) < this.SERVER_CHECK_INTERVAL) {
      return this.serverOnline;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/api/v1/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      this.serverOnline = response.ok;
      this.lastServerCheck = now;
      return this.serverOnline;
    } catch (error) {
      this.serverOnline = false;
      this.lastServerCheck = now;
      return false;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
        // Set cookie for persistent login (expires in 7 days)
        // secure: only true in production (HTTPS), sameSite: 'lax' for better compatibility
        Cookies.set('accessToken', token, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' 
        });
      } else {
        localStorage.removeItem('accessToken');
        Cookies.remove('accessToken', { path: '/' });
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Quick server check before making the request (non-blocking)
    const serverStatus = await this.checkServerStatus();
    if (!serverStatus && typeof window !== 'undefined') {
      // Server is known to be offline - throw immediately with friendly message
      throw new Error('Unable to connect to the server. Please make sure the backend server is running on http://localhost:5000');
    }

    try {
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      let response: Response;
      try {
        response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        // If request succeeds, mark server as online
        if (response.ok) {
          this.serverOnline = true;
          this.lastServerCheck = Date.now();
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        // Mark server as offline
        this.serverOnline = false;
        this.lastServerCheck = Date.now();
        
        // Catch network errors immediately - this happens when backend is not running
        const errorName = fetchError?.name || '';
        const errorMessage = fetchError?.message || '';
        const errorStr = String(errorMessage).toLowerCase();
        
        if (errorName === 'AbortError') {
          throw new Error('Request timeout. The server is taking too long to respond. Please check if the backend server is running.');
        }
        
        // Check for all possible network error patterns
        // IMPORTANT: Browser console will ALWAYS show "Failed to fetch" - this is normal browser behavior
        // We cannot suppress it, but we catch it here and provide a user-friendly error message
        if (errorName === 'TypeError' || 
            errorMessage === 'Failed to fetch' ||
            errorStr.includes('failed to fetch') ||
            errorStr.includes('networkerror') ||
            errorStr.includes('network error') ||
            errorStr.includes('err_connection_refused') ||
            errorStr.includes('err_name_not_resolved') ||
            errorStr.includes('load failed') ||
            errorStr.includes('network request failed') ||
            errorStr.includes('fetch')) {
          // Create a user-friendly error message
          // The console error is expected - browsers always log network failures
          const friendlyError = new Error('Unable to connect to the server. Please make sure the backend server is running on http://localhost:5000');
          throw friendlyError;
        }
        throw fetchError;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, read as text
          const text = await response.text();
          throw new Error(text || 'Invalid response from server');
        }
      } else {
        // If not JSON, read as text
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || 'Request failed');
        }
        // If successful but not JSON, return as data
        return { success: true, message: 'Success', data: text } as ApiResponse<T>;
      }

      if (!response.ok) {
        // If unauthorized (401), clear token and redirect to login
        if (response.status === 401) {
          this.setToken(null);
          // Only redirect if we're in the browser and not already on login/signup pages
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/login') && !currentPath.startsWith('/signup')) {
              // Store the current path to redirect back after login
              sessionStorage.setItem('redirectAfterLogin', currentPath);
              window.location.href = '/login';
            }
          }
        }
        
        // Extract clean error message from response using utility
        const errorMessage = extractErrorMessage(data || 'Request failed');
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      // Handle network errors - backend server not running
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. The server is taking too long to respond. Please check if the backend server is running.');
      }
      
      if (error.message === 'Failed to fetch' || 
          error.name === 'TypeError' || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError') ||
          (error.message && typeof error.message === 'string' && error.message.toLowerCase().includes('failed to fetch'))) {
        const friendlyError = new Error('Unable to connect to the server. Please make sure the backend server is running on http://localhost:5000');
        // Don't log to console in production, but keep it for debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn('Backend server connection failed. Make sure the server is running on http://localhost:5000');
        }
        throw friendlyError;
      }
      
      // Extract clean error message using utility function
      const cleanMessage = extractErrorMessage(error);
      throw new Error(cleanMessage);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<T>(endpoint + queryString, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload helper
  async uploadFile(file: File): Promise<string> {
    // For now, convert to base64. In production, upload to S3/Wasabi
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  requestOTP: (phoneNumber: string, purpose: string) =>
    api.post('/auth/otp/request', { phoneNumber, purpose }),

  verifyOTP: (phoneNumber: string, code: string, purpose: string) =>
    api.post('/auth/otp/verify', { phoneNumber, code, purpose }),

  register: (data: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
    role?: 'FARMER' | 'BUYER';
    language?: string;
  }) => api.post('/auth/register', data),

  login: (phoneNumber: string, password: string) =>
    api.post('/auth/login', { phoneNumber, password }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: (refreshToken?: string) =>
    api.post('/auth/logout', { refreshToken }),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { oldPassword, newPassword }),

  resetPassword: (phoneNumber: string, otp: string, newPassword: string) =>
    api.post('/auth/reset-password', { phoneNumber, otp, newPassword }),

  setPassword: (newPassword: string) =>
    api.post('/auth/set-password', { newPassword }),
};

// User API
export const userApi = {
  getMe: () => api.get('/users/me'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updateFarmerProfile: (data: any) => api.put('/users/farmer/profile', data),
  updateBuyerProfile: (data: any) => api.put('/users/buyer/profile', data),
  submitVerification: (documents: string[]) =>
    api.post('/users/farmer/verification', { documents }),
  getUserStats: () => api.get('/users/stats'),
};

// Product API
export const productApi = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minQuantity?: number;
    search?: string;
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating';
  }) => api.get('/products', params),

  getProductById: (id: string) => api.get(`/products/${id}`),

  createProduct: (data: {
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
  }) => api.post('/products', data),

  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),

  deleteProduct: (id: string) => api.delete(`/products/${id}`),

  getFarmerProducts: () => api.get('/products/farmer/my-products'),

  getCategories: () => api.get('/products/categories'),

  getLocations: () => api.get('/products/locations'),
};

// Order API - REMOVED: Order functionality has been permanently removed

// Payment API
export const paymentApi = {
  initializePayment: (id: string, paymentMethod?: string) =>
    api.post(`/payments/${id}/initialize`, { paymentMethod }),

  getPaymentById: (id: string) => api.get(`/payments/${id}`),

  releaseEscrow: (id: string) => api.post(`/payments/${id}/release-escrow`),
};

// Review API
export const reviewApi = {
  createReview: (orderId: string, data: { rating: number; comment?: string }) =>
    api.post(`/reviews/order/${orderId}`, data),

  getUserReviews: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/user/${userId}`, params),

  getProductReviews: (productId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/product/${productId}`, params),

  updateReview: (id: string, data: { rating?: number; comment?: string }) =>
    api.put(`/reviews/${id}`, data),

  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

// Chat API
export const chatApi = {
  sendMessage: (orderId: string, data: {
    content: string;
    messageType?: string;
    attachments?: string[];
  }) => api.post(`/chat/order/${orderId}/messages`, data),

  getOrderMessages: (orderId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/chat/order/${orderId}/messages`, params),

  getConversations: (params?: { page?: number; limit?: number }) =>
    api.get('/chat/conversations', params),

  getUnreadCount: () => api.get('/chat/unread-count'),

  markAsRead: (messageIds: string[]) =>
    api.post('/chat/mark-read', { messageIds }),
};

// Notification API
export const notificationApi = {
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
  }) => api.get('/notifications', params),

  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch('/notifications/read-all'),

  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),

  getUnreadCount: () => api.get('/notifications/unread-count'),
};
