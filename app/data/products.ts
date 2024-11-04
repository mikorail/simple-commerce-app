// data/products.ts
import { Product } from '../types/products';

export const productData: Product[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000', // UUID as a string
    name: 'Product 1',
    price: 99.99,
    stock: 10,
    description: 'Description for product 1.',
    image: 'path/to/image.jpg',
    category: 'Electronics',
    shopEmail: 'shop@example.com',
  },
  {
    id: 'asjasoajosaf-123e4567-e89b-12d3-a456-426614174000', // UUID as a string
    name: 'Product 2',
    price: 150,
    description: 'Description for Product 2',
    category: 'Home Decor',
    shopEmail: 'shop2@example.com',
    image: 'https://picsum.photos/seed/product2/300/300',
    stock: 5, // Add stock information
  },
  // Add more products as necessary...
];
