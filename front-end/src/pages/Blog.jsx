import React from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: 'How AgriPay Farmers Increased Yields by 150%',
      excerpt: 'Discover the success stories of Kenyan maize farmers who transformed their harvests using AgriPay market insights.',
      category: 'Success Stories',
      readTime: '5 min read',
      date: 'March 15, 2024',
      image: '🌽',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 2,
      title: 'Market Intelligence: Predicting Crop Prices in East Africa',
      excerpt: 'Learn how AgriPay analytics help farmers make informed decisions about when and where to sell their produce.',
      category: 'Market Insights',
      readTime: '7 min read',
      date: 'March 12, 2024',
      image: '📊',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      title: 'M-Pesa Integration: Revolutionizing Agricultural Payments',
      excerpt: 'How seamless mobile payments are transforming financial inclusion for smallholder farmers across Africa.',
      category: 'Technology',
      readTime: '4 min read',
      date: 'March 10, 2024',
      image: '💰',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 4,
      title: 'Climate-Smart Agriculture Practices for African Farmers',
      excerpt: 'Expert advice on adapting to climate change while maintaining productivity and sustainability.',
      category: 'Expert Advice',
      readTime: '6 min read',
      date: 'March 8, 2024',
      image: '🌍',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 5,
      title: 'Building Trust: How AgriPay Verifies Buyers and Sellers',
      excerpt: 'The technology and processes behind our secure marketplace that protects all stakeholders.',
      category: 'Platform News',
      readTime: '3 min read',
      date: 'March 5, 2024',
      image: '🛡️',
      color: 'from-teal-500 to-green-600'
    },
    {
      id: 6,
      title: 'From Farm to Table: Logistics Success in Rwanda',
      excerpt: 'Case study of how our logistics network reduced food waste and increased farmer profits by 40%.',
      category: 'Case Study',
      readTime: '8 min read',
      date: 'March 1, 2024',
      image: '🚚',
      color: 'from-amber-500 to-yellow-600'
    }
  ];

  const categories = [
    { name: 'All Articles', count: 24, color: 'bg-gray-500' },
    { name: 'Success Stories', count: 8, color: 'bg-green-500' },
    { name: 'Market Insights', count: 6, color: 'bg-blue-500' },
    { name: 'Expert Advice', count: 5, color: 'bg-purple-500' },
    { name: 'Technology', count: 3, color: 'bg-orange-500' },
    { name: 'Platform News', count: 2, color: 'bg-teal-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-yellow-500 rounded-2xl transform group-hover:rotate-0 transition-transform duration-300 shadow-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold">🌱</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                  AgriPay Blog
                </h1>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            AgriPay <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Knowledge, insights, and stories from Africa's agricultural revolution. 
            Learn from experts, discover market trends, and join our community success stories.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search articles on farming, markets, technology..."
                className="w-full px-6 py-4 rounded-2xl border border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none shadow-lg bg-white/80 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-amber-200 sticky top-32">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-amber-50 rounded-2xl border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">Stay Updated</h4>
                <p className="text-sm text-gray-600 mb-3">Get the latest articles on African agriculture</p>
                <div className="space-y-2">
                  <input 
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm"
                  />
                  <button className="w-full bg-gradient-to-r from-green-600 to-yellow-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Blog Posts */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <article 
                  key={post.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-amber-100 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                >
                  {/* Post Header */}
                  <div className={`h-4 bg-gradient-to-r ${post.color}`}></div>
                  
                  <div className="p-6">
                    {/* Category & Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>

                    {/* Title & Excerpt */}
                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${post.color} flex items-center justify-center text-white`}>
                          {post.image}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">AgriPay Team</div>
                          <div className="text-xs text-gray-500">Agricultural Experts</div>
                        </div>
                      </div>
                      <button className="text-green-600 hover:text-green-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                Load More Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;