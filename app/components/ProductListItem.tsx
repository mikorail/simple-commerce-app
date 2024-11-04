// components/ProductListItem.tsx
import { FC } from 'react';
import Link from 'next/link';
import { Product } from '../types/products';

interface ProductListItemProps {
  product: Product;
  view: 'grid' | 'list';
}

const ProductListItem: FC<ProductListItemProps> = ({ product, view }) => {
  return (
    <div className={`border p-4 ${view === 'list' ? 'mb-4' : 'w-1/2 md:w-1/4 p-2'}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative cursor-pointer"> {/* Added cursor pointer for better UX */}
          <span className="absolute top-2 left-2 text-xs font-semibold bg-blue-200 text-blue-800 rounded-full px-2 py-1">
            {product.category}
          </span>
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
        </div>
        <h3 className="font-semibold mt-2">{product.name}</h3>
        <p>${product.price.toFixed(2)}</p> {/* Ensures price is always formatted correctly */}
        <p className="text-sm text-gray-600">{product.shopEmail}</p>
      </Link>
    </div>
  );
};

export default ProductListItem;
