// components/ProductGridListToggle.tsx
import { FC, useState } from 'react';

type ToggleView = 'grid' | 'list';

interface ProductGridListToggleProps {
  onToggle: (view: ToggleView) => void;
}

const ProductGridListToggle: FC<ProductGridListToggleProps> = ({ onToggle }) => {
  const [view, setView] = useState<ToggleView>('grid');

  const handleToggle = (viewType: ToggleView) => {
    setView(viewType);
    onToggle(viewType);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <button
        className={`p-2 ${view === 'grid' ? 'bg-gray-200 text-gray-700' : 'text-gray-700'}`}
        onClick={() => handleToggle('grid')}
      >
        Grid View
      </button>
      <button
        className={`p-2 ${view === 'list' ? 'bg-gray-200 text-gray-700' : ''}`}
        onClick={() => handleToggle('list')}
      >
        List View
      </button>
    </div>
  );
};

export default ProductGridListToggle;
