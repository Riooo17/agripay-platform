// src/components/dashboard/ProductDiscovery.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { buyerService } from '../../services/buyerService';

const ProductDiscovery = ({ searchQuery = '' }) => {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');

  // AI Recommendations
  const aiRecommendations = [
    {
      id: 101,
      name: 'Organic Fertilizer',
      reason: 'Based on your maize purchases',
      price: 1200,
      supplier: 'AgroTech Solutions',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300&h=200&fit=crop'
    },
    {
      id: 102,
      name: 'Drip Irrigation Kit',
      reason: 'Popular in your region',
      price: 8500,
      supplier: 'WaterSmart Africa',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1621535853246-90c0b6f26881?w=300&h=200&fit=crop'
    }
  ];

  // Load real products from backend
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      console.log('🔄 Loading real products from backend...');
      
      try {
        const productsData = await buyerService.getProducts();
        if (productsData && productsData.length > 0) {
          setProducts(productsData);
          setFilteredProducts(productsData);
          console.log('✅ Real products loaded successfully:', productsData.length, 'products');
        } else {
          console.log('ℹ️ No products found or empty response');
        }
      } catch (error) {
        console.error('❌ Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.supplier?.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // Sort products
  useEffect(() => {
    const sortedProducts = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        // Keep original order or sort by popularity
        break;
    }
    
    setFilteredProducts(sortedProducts);
  }, [sortBy, JSON.stringify(filteredProducts)]);

  const handleAddToCart = (product) => {
    // Transform product to cart item format
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      unit: product.unit || 'kg',
      supplier: product.supplier?.name || product.supplier,
      image: product.image,
      quantity: product.minOrder || 1
    };
    
    addItem(cartItem);
    console.log('🛒 Added to cart:', cartItem);
    alert(`✅ ${product.name} added to cart!`);
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const result = await buyerService.addToWishlist(productId);
      if (result.success) {
        alert('✅ Added to wishlist!');
      } else {
        alert('❌ Failed to add to wishlist');
      }
    } catch (error) {
      alert('❌ Error adding to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h1 className="text-2xl font-bold text-green-800 mb-2">🔍 Product Discovery</h1>
          <p className="text-green-600">Loading products...</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-800 font-semibold">Loading products from farmers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <h1 className="text-2xl font-bold text-green-800 mb-2">🔍 Product Discovery</h1>
        <p className="text-green-600">Find quality agricultural products from verified suppliers across Africa</p>
        
        {searchQuery && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-700">
              Showing {filteredProducts.length} results for "<span className="font-semibold">{searchQuery}</span>"
            </p>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">🤖 AI Recommended for You</h2>
            <p className="opacity-90">Smart suggestions based on your preferences</p>
          </div>
          <div className="text-3xl">⚡</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiRecommendations.map(product => (
            <div key={product.id} className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-white text-opacity-80 text-sm">{product.reason}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold">KSh {product.price}</p>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-white text-green-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-50"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-green-800">
            {filteredProducts.length} Products Available
          </h2>
          <div className="flex items-center space-x-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="popular">Sort by: Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id || product.id} className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 relative">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1592913407780-6655751792ab?w=400&h=300&fit=crop'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.certification || 'Verified'}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-green-900 text-lg">{product.name}</h3>
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                    <span className="text-yellow-800 text-sm font-medium">{product.rating || 4.5}</span>
                    <span className="text-yellow-600 ml-1">⭐</span>
                  </div>
                </div>
                
                <p className="text-green-600 text-sm mb-2">
                  {product.supplier?.name || product.supplier} • {product.location || 'Kenya'}
                </p>
                
                <p className="text-green-700 text-sm mb-3 line-clamp-2">
                  {product.description || 'High-quality agricultural product'}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-2xl font-bold text-green-800">KSh {product.price || 0}</span>
                    <span className="text-green-600 text-sm ml-2">per {product.unit || 'kg'}</span>
                  </div>
                  <span className="text-green-600 text-sm">
                    Min: {product.minOrder || 1} {product.unit || 'kg'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">No products found</h3>
            <p className="text-green-600">Try adjusting your search terms or check back later</p>
          </div>
        )}
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedProduct(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-green-900">
                        {selectedProduct.name}
                      </h3>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <img 
                        src={selectedProduct.image || 'https://images.unsplash.com/photo-1592913407780-6655751792ab?w=400&h=300&fit=crop'} 
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-green-600 mb-2">
                            {selectedProduct.supplier?.name || selectedProduct.supplier} • {selectedProduct.location || 'Kenya'}
                          </p>
                          <p className="text-green-700">{selectedProduct.description || 'High-quality agricultural product'}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                            <span className="text-yellow-800 font-medium">{selectedProduct.rating || 4.5}</span>
                            <span className="text-yellow-600 ml-1">⭐</span>
                            <span className="text-yellow-600 text-sm ml-2">
                              ({selectedProduct.reviews || 0} reviews)
                            </span>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {selectedProduct.certification || 'Verified'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-green-800">
                            KSh {selectedProduct.price || 0} <span className="text-lg text-green-600">per {selectedProduct.unit || 'kg'}</span>
                          </p>
                          <p className="text-green-600">Minimum order: {selectedProduct.minOrder || 1} {selectedProduct.unit || 'kg'}</p>
                          <p className="text-green-600">Stock: {selectedProduct.stock || 'Available'}</p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              handleAddToCart(selectedProduct);
                              setSelectedProduct(null);
                            }}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            Add to Cart
                          </button>
                          <button 
                            onClick={() => handleAddToWishlist(selectedProduct._id || selectedProduct.id)}
                            className="px-6 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            ♡ Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDiscovery;