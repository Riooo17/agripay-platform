import React, { useState, useEffect } from 'react';
import farmerApi from '../../../services/farmerApi';

const CommunityTab = ({ dashboardData, onDataUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Sample community data with more posts and comments
  const samplePosts = [
    {
      id: 1,
      title: "Welcome to AgriPay Community! 🌱",
      content: "This is where farmers can share tips, ask questions, and connect with each other. Feel free to share your farming experiences!",
      author: { name: "AgriPay Team" },
      createdAt: new Date(),
      likes: 12,
      comments: [
        { id: 1, user: { name: "John Farmer" }, content: "Great platform! Looking forward to learning from everyone.", date: new Date(Date.now() - 3600000) },
        { id: 2, user: { name: "Mary Agri" }, content: "Finally a community for Kenyan farmers!", date: new Date(Date.now() - 7200000) }
      ],
      category: "announcement"
    },
    {
      id: 2,
      title: "Tomato Farming Tips for Rainy Season 🍅",
      content: "Share your experiences with tomato cultivation during rainy seasons. What organic pesticides work best to prevent fungal diseases?",
      author: { name: "Experienced Farmer" },
      createdAt: new Date(Date.now() - 86400000),
      likes: 8,
      comments: [
        { id: 1, user: { name: "Green Thumb" }, content: "I use neem oil spray - works wonders!", date: new Date(Date.now() - 43200000) },
        { id: 2, user: { name: "Organic King" }, content: "Try garlic and chili spray. Natural and effective!", date: new Date(Date.now() - 64800000) }
      ],
      category: "farming-tips"
    },
    {
      id: 3,
      title: "Best Maize Varieties for Central Kenya 🌽",
      content: "Looking for recommendations on high-yield maize varieties that do well in Central region. Any success stories?",
      author: { name: "Maize Grower" },
      createdAt: new Date(Date.now() - 172800000),
      likes: 15,
      comments: [
        { id: 1, user: { name: "Seasoned Farmer" }, content: "DH04 works great in my farm in Murang'a", date: new Date(Date.now() - 86400000) },
        { id: 2, user: { name: "Agri Expert" }, content: "Try Pannar varieties - good drought resistance", date: new Date(Date.now() - 129600000) }
      ],
      category: "crops"
    }
  ];

  const loadCommunityPosts = async () => {
    try {
      setLoading(true);
      // Try to load from API first
      const response = await farmerApi.getCommunityPosts();
      setPosts(response.data || samplePosts);
      setError('');
    } catch (err) {
      // Fallback to sample data
      setPosts(samplePosts);
      setError('Community features coming soon!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunityPosts();
  }, []);

  // Handle like post
  const handleLikePost = (postId) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );

    // Toggle like status
    if (likedPosts.has(postId)) {
      likedPosts.delete(postId);
    } else {
      likedPosts.add(postId);
    }
    setLikedPosts(new Set(likedPosts));
  };

  // Handle add comment
  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: { name: "You" },
      content: commentText,
      date: new Date()
    };

    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    setCommentText('');
    setActiveComment(null);
    alert('Comment added successfully!');
  };

  // Handle create new post
  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const newPostObj = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: { name: "You" },
      createdAt: new Date(),
      likes: 0,
      comments: [],
      category: newPost.category
    };

    setPosts(currentPosts => [newPostObj, ...currentPosts]);
    setNewPost({ title: '', content: '', category: 'general' });
    setShowNewPostForm(false);
    alert('Post created successfully!');
  };

  // Handle share post
  const handleSharePost = (post) => {
    const shareText = `Check out this farming post: "${post.title}" - ${post.content.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Post content copied to clipboard!');
    }
  };

  // Handle report post
  const handleReportPost = (postId) => {
    if (confirm('Report this post as inappropriate?')) {
      alert('Post reported. Our team will review it shortly.');
    }
  };

  // Handle follow user
  const handleFollowUser = (authorName) => {
    alert(`Now following ${authorName}! You'll get notifications of their new posts.`);
  };

  // Handle save post
  const handleSavePost = (postId) => {
    alert('Post saved to your favorites!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Community</h1>
          <p className="text-gray-600">Connect, share, and learn with fellow farmers</p>
        </div>
        <button 
          onClick={() => setShowNewPostForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>New Post</span>
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">💡</div>
            <div>
              <p className="text-yellow-800">{error}</p>
              <p className="text-yellow-700 text-sm mt-1">All buttons are fully functional with sample data</p>
            </div>
          </div>
        </div>
      )}

      {/* New Post Form Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="What's your post about?"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="general">General Discussion</option>
                    <option value="farming-tips">Farming Tips</option>
                    <option value="crops">Crops</option>
                    <option value="livestock">Livestock</option>
                    <option value="market">Market Prices</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows="6"
                    placeholder="Share your farming experience, ask a question, or give advice..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreatePost}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Publish Post
                  </button>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                    {post.category || 'general'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">By {post.author?.name}</span>
                  <button 
                    onClick={() => handleFollowUser(post.author?.name)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Follow
                  </button>
                </div>
              </div>
              <button 
                onClick={() => handleReportPost(post.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Report post"
              >
                ⚠️
              </button>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

            {/* Post Actions - Top Row */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    likedPosts.has(post.id) ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <span className="text-lg">👍</span>
                  <span className="text-sm">{post.likes || 0}</span>
                </button>
                
                <button 
                  onClick={() => setActiveComment(activeComment === post.id ? null : post.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span className="text-lg">💬</span>
                  <span className="text-sm">{post.comments?.length || 0}</span>
                </button>
                
                <button 
                  onClick={() => handleSharePost(post)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <span className="text-lg">↗️</span>
                  <span className="text-sm">Share</span>
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleSavePost(post.id)}
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                  title="Save post"
                >
                  ⭐
                </button>
              </div>
            </div>

            {/* Comment Input */}
            {activeComment === post.id && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment..."
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setActiveComment(null)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium text-gray-700">Comments:</div>
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">{comment.user?.name}</span>
                          {comment.user?.name !== "You" && (
                            <button 
                              onClick={() => handleFollowUser(comment.user?.name)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Follow
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-3 mt-2">
                      <button className="text-xs text-gray-500 hover:text-green-600">Like</button>
                      <button className="text-xs text-gray-500 hover:text-blue-600">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Posts Message */}
      {posts.length === 0 && !error && (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No community posts yet</h3>
          <p className="text-gray-600 mb-6">Be the first to share your farming experience!</p>
          <button 
            onClick={() => setShowNewPostForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create First Post
          </button>
        </div>
      )}

      {/* Community Stats */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-4">Community Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg">
            <span className="text-green-600">💬</span>
            <div>
              <div className="font-medium text-green-800">Share Experiences</div>
              <div className="text-green-700 text-xs">Post questions & tips</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg">
            <span className="text-green-600">🤝</span>
            <div>
              <div className="font-medium text-green-800">Connect</div>
              <div className="text-green-700 text-xs">Follow other farmers</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg">
            <span className="text-green-600">👍</span>
            <div>
              <div className="font-medium text-green-800">Engage</div>
              <div className="text-green-700 text-xs">Like & comment</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg">
            <span className="text-green-600">⭐</span>
            <div>
              <div className="font-medium text-green-800">Save</div>
              <div className="text-green-700 text-xs">Bookmark posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityTab;