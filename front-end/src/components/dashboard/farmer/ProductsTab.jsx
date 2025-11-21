import React, { useState, useEffect } from 'react';
import farmerApi from '../../../services/farmerApi';

const ProductsTab = ({ dashboardData, onDataUpdate, formatCurrency }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vegetables',
    stock: '',
    unit: 'kg',
    image: ''
  });

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await farmerApi.getProducts();
      setProducts(response.data || []);
    } catch (err) {
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setProductForm(prev => ({ ...prev, image: imageUrl }));
    }
  };

  // Reset form
  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'vegetables',
      stock: '',
      unit: 'kg',
      image: ''
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  // Create or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };

      if (editingProduct) {
        await farmerApi.updateProduct(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        await farmerApi.createProduct(productData);
        alert('Product created successfully!');
      }

      resetForm();
      loadProducts();
      onDataUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit,
      image: product.image || ''
    });
    setShowProductForm(true);
  };

  // Delete Product
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await farmerApi.deleteProduct(productId);
      alert('Product deleted successfully!');
      loadProducts();
      onDataUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle Product Status
  const handleToggleStatus = async (product) => {
    try {
      await farmerApi.updateProduct(product.id, {
        isActive: !product.isActive
      });
      alert(`Product ${!product.isActive ? 'activated' : 'deactivated'}!`);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your farm products and inventory</p>
        </div>
        
        <button
          onClick={() => setShowProductForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="poultry">Poultry</option>
          </select>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {productForm.image && (
                    <img 
                      src={productForm.image} 
                      alt="Preview" 
                      className="mt-2 h-32 w-32 object-cover rounded border"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (KES) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains</option>
                      <option value="dairy">Dairy</option>
                      <option value="poultry">Poultry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={productForm.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="kg">Kilogram</option>
                      <option value="g">Gram</option>
                      <option value="litre">Litre</option>
                      <option value="piece">Piece</option>
                      <option value="bunch">Bunch</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try changing your search or filter criteria'
              : 'Get started by adding your first product'
            }
          </p>
          <button
            onClick={() => setShowProductForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id || `product-${index}`} className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
              !product.isActive ? 'opacity-60' : ''
            }`}>
              {/* Product Image */}
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-3xl">🌱</span>
                </div>
              )}

              {/* Product Details */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-gray-500 capitalize mb-2">{product.category}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(product.price)}/{product.unit}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleToggleStatus(product)}
                  className={`flex-1 py-2 px-3 rounded text-sm hover:opacity-80 ${
                    product.isActive 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
                
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-600">
              Active: {products.filter(p => p.isActive).length}
            </span>
            <span className="text-red-600">
              Inactive: {products.filter(p => !p.isActive).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;

