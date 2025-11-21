// File: /src/components/seller/ProductManager.jsx
import React, { useState } from 'react';
import { Search, Filter, Plus, Edit3, Trash2, Eye, Share2, Download } from 'lucide-react';

const ProductManager = ({ inventory, setInventory, onQuickSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setInventory(inventory.filter(p => p.id !== productId));
    }
  };

  const handleToggleStatus = (productId) => {
    setInventory(inventory.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const handleEditProduct = (product) => {
    const newName = prompt('Enter new product name:', product.name);
    const newPrice = prompt('Enter new price:', product.price);
    const newStock = prompt('Enter new stock quantity:', product.stock);

    if (newName && newPrice && newStock) {
      setInventory(inventory.map(p => 
        p.id === product.id 
          ? { 
              ...p, 
              name: newName,
              price: parseInt(newPrice),
              stock: parseInt(newStock)
            }
          : p
      ));
    }
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Math.max(...inventory.map(p => p.id), 0) + 1,
      name: 'New Agricultural Product',
      category: 'Seeds',
      price: 1000,
      stock: 10,
      lowStock: 5,
      image: '🌱',
      rating: 4.0,
      description: 'Describe your product here',
      status: 'active'
    };
    setInventory([...inventory, newProduct]);
  };

  const handleExportProducts = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Category,Price,Stock,Status,Rating\n"
      + inventory.map(product => 
          `${product.id},"${product.name}",${product.category},${product.price},${product.stock},${product.status},${product.rating}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agripay_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Product Catalog</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleExportProducts}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Seeds">Seeds</option>
            <option value="Fertilizers">Fertilizers</option>
            <option value="Equipment">Equipment</option>
            <option value="Tools">Tools</option>
            <option value="Pesticides">Pesticides</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="overflow-hidden">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Product Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-4xl">{product.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm font-semibold text-green-600">
                        KES {product.price.toLocaleString()}
                      </span>
                      <span className={`text-sm font-medium ${
                        product.stock <= product.lowStock 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {product.stock} in stock
                      </span>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(product.rating))}
                        </div>
                        <span className="ml-1 text-sm text-gray-500">({product.rating})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onQuickSale(product)}
                    disabled={product.stock === 0 || product.status !== 'active'}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Quick Sale
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(product.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.status === 'active'
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Share Product"
                    onClick={() => {
                      navigator.clipboard.writeText(product.name);
                      alert(`Product "${product.name}" copied to clipboard!`);
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first product'
            }
          </p>
          <button 
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Add New Product
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Showing {filteredProducts.length} of {inventory.length} products</span>
          <span>{inventory.filter(p => p.stock <= p.lowStock).length} low stock items</span>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;