import React, { useState } from 'react';

const RegistrationForm = ({ selectedRole, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    location: '',
    businessName: '',
    expertise: '',
    vehicleType: '',
    institutionName: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (selectedRole === 'farmer' && !formData.farmName) {
      newErrors.farmName = 'Farm name is required';
    }
    if (selectedRole === 'input_seller' && !formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }
    if (selectedRole === 'expert' && !formData.expertise) {
      newErrors.expertise = 'Expertise area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    const userData = {
      ...formData,
      role: selectedRole
    };

    delete userData.confirmPassword;

    console.log('🔄 SENDING REGISTRATION DATA:', userData);

    try {
      const result = await onSubmit(userData);
      console.log('📩 REGISTRATION RESPONSE:', result);
      
      if (!result) {
        setSubmitError('No response from server');
        return;
      }
      
      if (result.success) {
        console.log('✅ Registration successful');
        // Success - the form will be handled by parent component
      } else {
        setSubmitError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'farmer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Name *
              </label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.farmName ? 'border-red-500' : 'border-gray-300'
                } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
                placeholder="Enter your farm name"
              />
              {errors.farmName && <p className="text-red-500 text-sm mt-1">{errors.farmName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                placeholder="Enter your farm location"
              />
            </div>
          </div>
        );

      case 'buyer':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
              placeholder="Enter your business name"
            />
          </div>
        );

      case 'input_seller':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.businessName ? 'border-red-500' : 'border-gray-300'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
              placeholder="Enter your business name"
            />
            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
          </div>
        );

      case 'expert':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area of Expertise *
            </label>
            <select
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.expertise ? 'border-red-500' : 'border-gray-300'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
            >
              <option value="">Select your expertise</option>
              <option value="crop_production">Crop Production</option>
              <option value="livestock">Livestock Management</option>
              <option value="soil_science">Soil Science</option>
              <option value="pest_management">Pest Management</option>
              <option value="irrigation">Irrigation Systems</option>
              <option value="organic_farming">Organic Farming</option>
            </select>
            {errors.expertise && <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>}
          </div>
        );

      case 'logistics':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
            >
              <option value="">Select vehicle type</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="pickup_truck">Pickup Truck</option>
              <option value="refrigerated_truck">Refrigerated Truck</option>
              <option value="truck">Large Truck</option>
            </select>
          </div>
        );

      case 'financial':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution Name
            </label>
            <input
              type="text"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
              placeholder="Enter your institution name"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
          placeholder="e.g., 254712345678"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {getRoleSpecificFields()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
            placeholder="Create a password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {submitError}
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-amber-400 text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-300 font-semibold"
        >
          Back to Role Selection
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;