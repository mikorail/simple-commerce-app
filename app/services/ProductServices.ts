// services/productService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProducts = async ({
  name = '',
  category = '',
  minPrice = '',
  maxPrice = '',
  minStock = '',
  maxStock = '',
  startDate = '',
  endDate = '',
  page = 1,
  limit = 10,
}: {
  name?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minStock?: string;
  maxStock?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  if (!API_URL) {
    console.error('API_URL is not defined. Please check your environment variables.');
    return { products: [], totalProducts: 0 }; // Return an empty array and totalProducts as 0 if URL is not defined
  }

  const queryParams = new URLSearchParams();

  // Append filters only if they have values
  if (name) queryParams.append('name', name);
  if (category) queryParams.append('category', category);
  if (minPrice) queryParams.append('minPrice', minPrice);
  if (maxPrice) queryParams.append('maxPrice', maxPrice);
  if (minStock) queryParams.append('minStock', minStock);
  if (maxStock) queryParams.append('maxStock', maxStock);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  queryParams.append('page', String(page)); // Ensure page is a string
  queryParams.append('limit', String(limit)); // Ensure limit is a string

  try {
    const response = await fetch(`${API_URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data.products)) {
      console.error('Expected data.data.products to be an array:', data.data);
      return { products: [], totalProducts: 0 }; // Return an empty array if the structure is unexpected
    }

    // Map through the products and assign an image URL
    const productsWithImages = data.data.products.map((product: { id: number; }) => ({
      ...product,
      image: `https://picsum.photos/seed/${product.id}/300/200`, // Generates a unique image URL
    }));

    const totalProducts = data.data.pagination.totalProducts; // Get the total number of products

    return { products: productsWithImages, totalProducts }; // Return the array of products with images and totalProducts
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], totalProducts: 0 }; // Return an empty array if there's an error
  }
};


export const fetchProduct = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:4000/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Check if the product data is structured correctly
    if (!data.data) {
      console.error('Expected data.data to exist:', data);
      return null; // Return null if the structure is unexpected
    }

    // Generate a unique image URL based on a random seed
    const seed = Math.floor(Math.random() * 10000); // Generates a random integer between 0 and 9999
    const productWithImage = {
      ...data.data,
      image: `https://picsum.photos/seed/${seed}/300/200`, // Generates a unique image URL
    };

    return productWithImage; // Return the product with the image
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null; // Return null if there's an error
  }
};

