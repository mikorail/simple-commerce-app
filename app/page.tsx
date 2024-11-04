'use client';
import { useEffect, useState } from 'react';
import ProductGridListToggle from './components/ProductGridListToggle';
import FilterComponent from './components/FilterComponent';
import ProductListItem from './components/ProductListItem';
import { Product } from './types/products';
import { fetchProducts } from './services/ProductServices';

const HomePage = () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        minStock: '',
        maxStock: '',
        startDate: '',
        endDate: '',
        limit: 10,
    });
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Initialize as empty array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadProducts = async (page: number = currentPage) => {
      setLoading(true);
      setError(null);
      try {
          const { products, totalProducts } = await fetchProducts({
              category: filters.category,
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
              minStock: filters.minStock,
              maxStock: filters.maxStock,
              startDate: filters.startDate,
              endDate: filters.endDate,
              name: filters.name,
              page,
              limit: filters.limit,
          });
  
          console.log('Fetched products:', products, totalProducts);
          setFilteredProducts(products);
          setTotalPages(Math.max(1, Math.ceil(totalProducts / filters.limit)));
          setCurrentPage(page);
      } catch (err) {
          console.error('Error loading products:', err);
          setError('Failed to load products.');
          setFilteredProducts([]); // Reset to empty array on error
          setTotalPages(1);
      } finally {
          setLoading(false);
      }
  };
    const handleToggle = (viewType: 'grid' | 'list') => setView(viewType);

    const handleFilter = (name: string, value: string) => {
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        loadProducts(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            loadProducts(page);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []); // Only run on mount

    const PaginationControls = () => {
        // Only show pagination if we have products and more than one page
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;

                        // Show first page, last page, current page, and one page before and after current
                        if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-4 py-2 border rounded-md ${
                                        isCurrentPage
                                            ? 'bg-blue-500 text-white'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }

                        // Show ellipsis for gaps
                        if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                        ) {
                            return <span key={pageNumber} className="px-2">...</span>;
                        }

                        return null;
                    })}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        );
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
                <div>
                    <ProductGridListToggle onToggle={handleToggle} />
                    <div className={`flex ${view === 'grid' ? 'flex-wrap -mx-2' : 'flex-col'}`}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductListItem key={product.id} product={product} view={view} />
                            ))
                        ) : (
                            <div className="text-center text-gray-500">No products found.</div>
                        )}
                    </div>
                    <PaginationControls />
                </div>
                <aside className="hidden lg:block">
                    <FilterComponent
                        onFilter={handleFilter}
                        onApplyFilters={handleApplyFilters}
                        filters={filters}
                    />
                </aside>
            </div>
        </div>
    );
};

export default HomePage;
