const Consultation = require('../models/Consultation');
const ExpertProfile = require('../models/ExpertProfile');
const KnowledgeContent = require('../models/KnowledgeContent');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get expert dashboard overview
// @route   GET /api/expert/dashboard
// @access  Private (Expert only)
exports.getDashboard = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;

    const [
      pendingConsultations,
      scheduledConsultations,
      totalEarnings,
      activeClients,
      recentConsultations,
      expertProfile
    ] = await Promise.all([
      // Pending consultation requests
      Consultation.countDocuments({ 
        expert: expertId,
        status: 'requested' 
      }),
      
      // Scheduled consultations
      Consultation.countDocuments({ 
        expert: expertId,
        status: { $in: ['accepted', 'scheduled'] } 
      }),
      
      // Total earnings
      Consultation.aggregate([
        { 
          $match: { 
            expert: new mongoose.Types.ObjectId(expertId),
            status: 'completed',
            'pricing.paymentStatus': 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$pricing.agreedAmount' } } }
      ]),
      
      // Active clients (farmers who have completed consultations)
      Consultation.distinct('farmer', { 
        expert: expertId,
        status: 'completed' 
      }),
      
      // Recent consultations
      Consultation.find({ expert: expertId })
        .populate('farmer', 'profile.firstName profile.lastName profile.phone profile.avatar')
        .sort({ createdAt: -1 })
        .limit(5),
      
      // Expert profile for stats
      ExpertProfile.findOne({ expert: expertId })
    ]);

    // Knowledge content stats
    const knowledgeStats = await KnowledgeContent.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(expertId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalViews: { $sum: '$engagement.views' },
          totalLikes: { $sum: '$engagement.likes' }
        }
      }
    ]);

    const totalEarningsAmount = totalEarnings.length > 0 ? totalEarnings[0].total : 0;

    res.json({
      success: true,
      data: {
        overview: {
          pendingConsultations,
          scheduledConsultations,
          totalEarnings: totalEarningsAmount,
          activeClients: activeClients.length,
          averageRating: expertProfile?.stats?.averageRating || 0,
          responseRate: expertProfile?.stats?.responseRate || 0
        },
        recentConsultations,
        knowledgeStats,
        impactMetrics: {
          farmersHelped: expertProfile?.stats?.completedConsultations || 0,
          successRate: '94%',
          yieldImprovement: '35%',
          costReduction: '28%'
        },
        quickStats: {
          completionRate: '98%',
          clientSatisfaction: '4.8/5',
          responseTime: '2.3 hours'
        }
      }
    });
  } catch (error) {
    console.error('Expert dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expert dashboard data',
      error: error.message
    });
  }
};

// @desc    Get consultation requests
// @route   GET /api/expert/consultations
// @access  Private (Expert only)
exports.getConsultations = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { expert: expertId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const consultations = await Consultation.find(query)
      .populate('farmer', 'profile.firstName profile.lastName profile.phone profile.avatar farmerProfile.farmName farmerProfile.mainCrops farmerProfile.farmSize')
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Consultation.countDocuments(query);
    
    // Consultation statistics
    const consultationStats = await Consultation.aggregate([
      { $match: { expert: new mongoose.Types.ObjectId(expertId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEarnings: { $sum: '$pricing.agreedAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        consultations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalConsultations: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: consultationStats
      }
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultations',
      error: error.message
    });
  }
};

// @desc    Update consultation status
// @route   PUT /api/expert/consultations/:id
// @access  Private (Expert only)
exports.updateConsultation = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const consultationId = req.params.id;
    const { status, scheduledDate, scheduledTime, agreedAmount, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Find consultation and verify ownership
    const consultation = await Consultation.findOne({ 
      _id: consultationId, 
      expert: expertId 
    });
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found or access denied'
      });
    }
    
    // Update consultation
    consultation.status = status;
    
    if (scheduledDate) {
      consultation.scheduledDate = scheduledDate;
    }
    
    if (scheduledTime) {
      consultation.scheduledTime = scheduledTime;
    }
    
    if (agreedAmount) {
      consultation.pricing.agreedAmount = agreedAmount;
    }
    
    if (notes) {
      consultation.notes.preConsultation = notes;
    }
    
    // Add message for status change
    consultation.messages.push({
      sender: expertId,
      message: `Consultation status updated to ${status}`,
      messageType: 'text'
    });
    
    await consultation.save();
    
    // Update expert stats if consultation is completed
    if (status === 'completed') {
      await updateExpertStats(expertId);
    }
    
    // Populate for response
    await consultation.populate('farmer', 'profile.firstName profile.lastName profile.phone');
    
    res.json({
      success: true,
      message: `Consultation ${status} successfully`,
      data: consultation
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating consultation',
      error: error.message
    });
  }
};

// @desc    Set expert availability
// @route   POST /api/expert/availability
// @access  Private (Expert only)
exports.setAvailability = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { workingHours, workingDays, timezone, unavailableDates } = req.body;
    
    // Find or create expert profile
    let expertProfile = await ExpertProfile.findOne({ expert: expertId });
    
    if (!expertProfile) {
      expertProfile = new ExpertProfile({
        expert: expertId,
        availability: {
          workingHours: workingHours || { start: '09:00', end: '17:00' },
          workingDays: workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timezone: timezone || 'Africa/Nairobi'
        }
      });
    } else {
      expertProfile.availability = {
        workingHours: workingHours || expertProfile.availability.workingHours,
        workingDays: workingDays || expertProfile.availability.workingDays,
        timezone: timezone || expertProfile.availability.timezone,
        unavailableDates: unavailableDates || expertProfile.availability.unavailableDates
      };
    }
    
    await expertProfile.save();
    
    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: expertProfile.availability
    });
  } catch (error) {
    console.error('Set availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting availability',
      error: error.message
    });
  }
};

// @desc    Get expert clients
// @route   GET /api/expert/clients
// @access  Private (Expert only)
exports.getClients = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    
    // Get clients with their consultation history
    const clients = await Consultation.aggregate([
      { $match: { expert: new mongoose.Types.ObjectId(expertId) } },
      {
        $group: {
          _id: '$farmer',
          totalConsultations: { $sum: 1 },
          completedConsultations: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalSpent: { $sum: '$pricing.agreedAmount' },
          lastConsultation: { $max: '$createdAt' },
          firstConsultation: { $min: '$createdAt' }
        }
      },
      { $sort: { lastConsultation: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      { $unwind: '$farmer' }
    ]);
    
    const total = await Consultation.distinct('farmer', { expert: expertId });
    
    res.json({
      success: true,
      data: {
        clients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total.length / limit),
          totalClients: total.length,
          hasNext: page < Math.ceil(total.length / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

// @desc    Provide agricultural advice
// @route   POST /api/expert/advice
// @access  Private (Expert only)
exports.provideAdvice = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { consultationId, recommendations, followUpRequired, followUpDate, attachments } = req.body;
    
    if (!consultationId || !recommendations) {
      return res.status(400).json({
        success: false,
        message: 'Consultation ID and recommendations are required'
      });
    }
    
    // Find consultation and verify ownership
    const consultation = await Consultation.findOne({ 
      _id: consultationId, 
      expert: expertId 
    });
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found or access denied'
      });
    }
    
    // Update consultation with advice
    consultation.notes.recommendations = recommendations;
    consultation.notes.followUpRequired = followUpRequired || false;
    
    if (followUpRequired && followUpDate) {
      consultation.notes.followUpDate = followUpDate;
      
      // Create follow-up entry
      consultation.followUps.push({
        followUpDate: followUpDate,
        notes: 'Scheduled follow-up based on initial consultation',
        completed: false
      });
    }
    
    if (attachments && attachments.length > 0) {
      consultation.attachments.push(...attachments.map(att => ({
        ...att,
        uploadedBy: expertId
      })));
    }
    
    // Add message with advice
    consultation.messages.push({
      sender: expertId,
      message: `Expert advice provided: ${recommendations.substring(0, 100)}...`,
      messageType: 'text'
    });
    
    await consultation.save();
    
    res.json({
      success: true,
      message: 'Advice provided successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Provide advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error providing advice',
      error: error.message
    });
  }
};

// @desc    Get knowledge content
// @route   GET /api/expert/knowledge
// @access  Private (Expert only)
exports.getKnowledgeContent = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { author: expertId };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const content = await KnowledgeContent.find(query)
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await KnowledgeContent.countDocuments(query);
    
    // Content statistics
    const contentStats = await KnowledgeContent.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(expertId) } },
      { 
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalViews: { $sum: '$engagement.views' },
          totalLikes: { $sum: '$engagement.likes' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalContent: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: contentStats
      }
    });
  } catch (error) {
    console.error('Get knowledge content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching knowledge content',
      error: error.message
    });
  }
};

// @desc    Create knowledge content
// @route   POST /api/expert/knowledge
// @access  Private (Expert only)
exports.createKnowledgeContent = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { type, title, content, category, tags, mediaDetails, status = 'draft' } = req.body;
    
    if (!type || !title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, content, and category are required'
      });
    }
    
    const knowledgeContent = new KnowledgeContent({
      author: expertId,
      type,
      title,
      content,
      category,
      tags: tags || [],
      mediaDetails: mediaDetails || {},
      status,
      publishedAt: status === 'published' ? new Date() : null
    });
    
    await knowledgeContent.save();
    
    res.status(201).json({
      success: true,
      message: 'Knowledge content created successfully',
      data: knowledgeContent
    });
  } catch (error) {
    console.error('Create knowledge content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating knowledge content',
      error: error.message
    });
  }
};

// @desc    Update knowledge content
// @route   PUT /api/expert/knowledge/:id
// @access  Private (Expert only)
exports.updateKnowledgeContent = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const contentId = req.params.id;
    const updateData = req.body;
    
    // Find content and verify ownership
    const content = await KnowledgeContent.findOne({ 
      _id: contentId, 
      author: expertId 
    });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found or access denied'
      });
    }
    
    // Update fields
    const allowedUpdates = [
      'title', 'content', 'category', 'tags', 'status', 
      'mediaDetails', 'featuredImage', 'attachments'
    ];
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        content[field] = updateData[field];
      }
    });
    
    // Handle publishing
    if (updateData.status === 'published' && content.status !== 'published') {
      content.publishedAt = new Date();
    }
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Knowledge content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Update knowledge content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating knowledge content',
      error: error.message
    });
  }
};

// @desc    Get expert analytics
// @route   GET /api/expert/analytics
// @access  Private (Expert only)
exports.getAnalytics = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const expertId = req.user._id;
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 30d
        startDate.setDate(now.getDate() - 30);
    }
    
    // Consultation analytics
    const consultationAnalytics = await Consultation.aggregate([
      {
        $match: {
          expert: new mongoose.Types.ObjectId(expertId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          consultations: { $sum: 1 },
          earnings: { $sum: '$pricing.agreedAmount' },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);
    
    // Content performance
    const contentPerformance = await KnowledgeContent.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(expertId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalViews: { $sum: '$engagement.views' },
          totalLikes: { $sum: '$engagement.likes' },
          totalComments: { $sum: '$engagement.comments' }
        }
      }
    ]);
    
    // Client analytics
    const clientAnalytics = await Consultation.aggregate([
      {
        $match: {
          expert: new mongoose.Types.ObjectId(expertId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$farmer',
          consultationCount: { $sum: 1 },
          totalSpent: { $sum: '$pricing.agreedAmount' },
          lastConsultation: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate client names
    await Consultation.populate(clientAnalytics, {
      path: '_id',
      select: 'profile.firstName profile.lastName profile.avatar'
    });

    res.json({
      success: true,
      data: {
        consultationAnalytics,
        contentPerformance,
        clientAnalytics,
        period,
        dateRange: {
          start: startDate,
          end: now
        }
      }
    });
  } catch (error) {
    console.error('Expert analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expert analytics',
      error: error.message
    });
  }
};

// Helper function to update expert stats
async function updateExpertStats(expertId) {
  const stats = await Consultation.aggregate([
    { $match: { expert: new mongoose.Types.ObjectId(expertId) } },
    {
      $group: {
        _id: null,
        totalConsultations: { $sum: 1 },
        completedConsultations: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalEarnings: { $sum: '$pricing.agreedAmount' },
        averageRating: { $avg: '$rating.byFarmer.rating' }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await ExpertProfile.findOneAndUpdate(
      { expert: expertId },
      {
        $set: {
          'stats.totalConsultations': stats[0].totalConsultations,
          'stats.completedConsultations': stats[0].completedConsultations,
          'stats.earnings': stats[0].totalEarnings,
          'stats.averageRating': stats[0].averageRating || 0
        }
      }
    );
  }
}