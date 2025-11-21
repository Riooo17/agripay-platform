// Production Deployment Configuration
const deployConfig = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'https://api.agripay.africa',
    timeout: 30000,
    retryAttempts: 3
  },

  // Monitoring & Analytics
  monitoring: {
    enabled: true,
    sentryDSN: process.env.REACT_APP_SENTRY_DSN,
    logLevel: 'warn',
    performanceTracking: true
  },

  // Feature Flags
  features: {
    investorMode: true,
    analytics: true,
    offlineMode: false,
    experimental: false
  },

  // Performance Optimization
  performance: {
    lazyLoading: true,
    codeSplitting: true,
    imageOptimization: true,
    caching: {
      enabled: true,
      duration: 3600000 // 1 hour
    }
  },

  // Security
  security: {
    corsOrigins: ['https://agripay.africa'],
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },

  // Error Handling
  errorHandling: {
    showDetailedErrors: false,
    logToService: true,
    userFriendlyMessages: true
  }
};

// Environment-specific configurations
const environmentConfigs = {
  development: {
    api: {
      baseURL: 'http://localhost:5000/api'
    },
    monitoring: {
      enabled: false
    },
    features: {
      experimental: true
    }
  },
  staging: {
    api: {
      baseURL: 'https://staging-api.agripay.africa'
    }
  },
  production: {
    // Use main config
  }
};

export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return {
    ...deployConfig,
    ...environmentConfigs[env]
  };
};

export default deployConfig;