const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        farmName,
        farmSize,
        mainCrops,
        farmingExperience,
        location,
        businessName
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: firstName, lastName, email, password, role'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Build user data
      const userData = {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        profile: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone?.trim(),
          businessName: businessName?.trim()
        }
      };

      // Add location if provided
      if (location) {
        userData.profile.location = {
          address: location.address,
          county: location.county,
          subCounty: location.subCounty,
          ward: location.ward,
          coordinates: location.coordinates
        };
      }

      // Add farmer-specific data
      if (role === 'farmer') {
        userData.farmerProfile = {
          farmName: farmName || (firstName + "'s Farm"),
          farmSize: farmSize || { value: 0, unit: 'acres' },
          mainCrops: mainCrops || [],
          farmingExperience: farmingExperience || 0
        };

        userData.stats = {
          totalProducts: 0,
          activeListings: 0,
          completedOrders: 0,
          totalRevenue: 0,
          customerRating: 0,
          reviewCount: 0
        };

        userData.preferences = {
          sellingRadius: 50,
          autoRestock: false,
          minimumOrder: 0
        };
      }

      // Create user
      const user = new User(userData);
      await user.save();

      // Generate tokens
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      const refreshToken = generateRefreshToken({ userId: user._id });

      // Prepare response data
      const responseData = {
        success: true,
        message: 'User registered successfully',
        token: token,
        refreshToken: refreshToken,
        user: {
          id: user._id,
          name: user.profile.firstName + ' ' + user.profile.lastName,
          email: user.email,
          role: user.role,
          phone: user.profile.phone,
          businessName: user.profile.businessName,
          isVerified: user.isVerified
        }
      };

      // Add farmer profile data to response
      if (role === 'farmer') {
        responseData.user.farmerProfile = user.farmerProfile;
        responseData.user.stats = user.stats;
        responseData.message = 'Farmer registered successfully';
      }

      res.status(201).json(responseData);

    } catch (error) {
      console.error('Registration error:', error);

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      const refreshToken = generateRefreshToken({ userId: user._id });

      const userResponse = {
        id: user._id,
        name: user.profile.firstName + ' ' + user.profile.lastName,
        email: user.email,
        role: user.role,
        phone: user.profile.phone,
        businessName: user.profile.businessName,
        isVerified: user.isVerified,
        profile: user.profile
      };

      if (user.role === 'farmer') {
        userResponse.farmerProfile = user.farmerProfile;
        userResponse.stats = user.stats;
        userResponse.preferences = user.preferences;
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        refreshToken: refreshToken,
        user: userResponse
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  },

  logout: async (req, res) => {
    try {
      // Clear token from client side
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  },

  getProfile: async (req, res, next) => {
    try {
      // FIX: Check if req.user exists first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await User.findById(req.user._id).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userData = {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile,
        settings: user.settings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      if (user.role === 'farmer') {
        userData.farmerProfile = user.farmerProfile;
        userData.stats = user.stats;
        userData.preferences = user.preferences;
        userData.business = user.business;
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        user: userData
      });
    } catch (error) {
      console.error('Get profile error:', error);
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      // FIX: Check if req.user exists first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const userId = req.user._id;
      const updateData = req.body;

      const allowedUpdates = [
        'profile.firstName', 'profile.lastName', 'profile.phone', 'profile.businessName',
        'profile.location', 'profile.bio', 'profile.avatar',
        'farmerProfile', 'business', 'preferences', 'settings'
      ];

      const updateFields = {};

      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          const fieldParts = field.split('.');
          if (fieldParts.length === 2) {
            if (!updateFields[fieldParts[0]]) updateFields[fieldParts[0]] = {};
            updateFields[fieldParts[0]][fieldParts[1]] = updateData[field];
          } else {
            updateFields[field] = updateData[field];
          }
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userData = {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile,
        settings: user.settings
      };

      if (user.role === 'farmer') {
        userData.farmerProfile = user.farmerProfile;
        userData.stats = user.stats;
        userData.preferences = user.preferences;
        userData.business = user.business;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: userData
      });

    } catch (error) {
      console.error('Update profile error:', error);

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors
        });
      }

      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      const newToken = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });
      const newRefreshToken = generateRefreshToken({ userId: user._id });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        token: newToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      console.error('Refresh token error:', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expired'
        });
      }

      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      // FIX: Check if req.user exists first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      next(error);
    }
  },

  verifyFarmer: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { status, documents } = req.body;

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role !== 'farmer') {
        return res.status(400).json({
          success: false,
          message: 'User is not a farmer'
        });
      }

      user.verification.status = status;
      if (documents) {
        user.verification.documents = documents;
      }

      if (status === 'verified') {
        user.isVerified = true;
        user.verification.verifiedAt = new Date();
      } else {
        user.isVerified = false;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Farmer ' + status + ' successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          verification: user.verification
        }
      });

    } catch (error) {
      console.error('Verify farmer error:', error);
      next(error);
    }
  }
};

module.exports = authController;