import { FC } from 'react';

interface FilterComponentProps {
  onFilter: (name: string, value: string) => void;
  onApplyFilters: () => void;
  filters: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minStock: string;
    maxStock: string;
    startDate: string;
    endDate: string;
    limit:number;
  };
}

const FilterComponent: FC<FilterComponentProps> = ({ onFilter, onApplyFilters, filters }) => {
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilter(name, value);
  };

  return (
    <div className="p-6 text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Filter Products</h3>
      
      <div className="space-y-4">

      <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-600">
            Limit
          </label>
          <input 
            id="limit"
            name="limit" // New name for the limit input
            value={filters.limit} // Set value to current filter state
            placeholder="e.g., 10"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            type="number"
            onChange={handleFilter} 
          />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input 
            id="name"
            name="name"
            value={filters.name} // Set value to current filter state
            placeholder="e.g., Product Name"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-600">
            Category
          </label>
          <input 
            id="category"
            name="category"
            value={filters.category} // Set value to current filter state
            placeholder="e.g., Electronics"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-600">
            Minimum Price
          </label>
          <input 
            id="minPrice"
            name="minPrice"
            value={filters.minPrice} // Set value to current filter state
            placeholder="e.g., 10"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            type="number"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-600">
            Maximum Price
          </label>
          <input 
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice} // Set value to current filter state
            placeholder="e.g., 100"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            type="number"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="minStock" className="block text-sm font-medium text-gray-600">
            Minimum Stock
          </label>
          <input 
            id="minStock"
            name="minStock"
            value={filters.minStock} // Set value to current filter state
            placeholder="e.g., 0"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            type="number"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="maxStock" className="block text-sm font-medium text-gray-600">
            Maximum Stock
          </label>
          <input 
            id="maxStock"
            name="maxStock"
            value={filters.maxStock} // Set value to current filter state
            placeholder="e.g., 100"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            type="number"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
            Created Date (Start)
          </label>
          <input 
            id="startDate"
            name="startDate"
            value={filters.startDate} // Set value to current filter state
            type="date"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            onChange={handleFilter} 
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">
            Created Date (End)
          </label>
          <input 
            id="endDate"
            name="endDate"
            value={filters.endDate} // Set value to current filter state
            type="date"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            onChange={handleFilter} 
          />
        </div>

        <button 
          type="button"
          onClick={onApplyFilters}
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
