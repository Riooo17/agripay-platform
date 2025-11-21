// src/components/dashboard/AdvancedSearch.jsx - Amazon-level Search
import React, { useState, useMemo } from 'react';

const AdvancedSearch = ({ onSearch, products }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    location: '',
    certification: '',
    deliveryTime: '',
    supplierRating: 0
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Smart search suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery) return [];
    const searchTerms = searchQuery.toLowerCase();
    return products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerms) ||
        product.category.toLowerCase().includes(searchTerms) ||
        product.supplier.toLowerCase().includes(searchTerms)
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const categories = [...new Set(products.map(p => p.category))];
  const locations = [...new Set(products.map(p => p.location))];

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      filters
    });
  };

  const quickSearches = [
    'Organic Maize',
    'Fresh Vegetables',
    'Export Quality',
    'Bulk Discount',
    'Same Day Delivery'
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 mb-6">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search products, suppliers, certifications..."
          className="w-full pl-12 pr-4 py-4 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
          <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && searchQuery && (
          <div className="absolute top-full left-0 right-0 bg-white border border-green-200 rounded-xl shadow-lg z-50 mt-1">
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                className="p-3 hover:bg-green-50 cursor-pointer border-b border-green-100 last:border-b-0"
                onClick={() => {
                  setSearchQuery(product.name);
                  handleSearch();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-green-900">{product.name}</p>
                    <p className="text-green-600 text-sm">{product.category} • {product.supplier}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickSearches.map(term => (
          <button
            key={term}
            onClick={() => {
              setSearchQuery(term);
              handleSearch();
            }}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors text-sm font-medium"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-green-600 hover:text-green-800 font-medium flex items-center space-x-2"
        >
          <span>⚙️ Advanced Filters</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Search
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Price: KSh {filters.priceRange[0]} - {filters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                className="w-full"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={5}>5 Stars Only</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;