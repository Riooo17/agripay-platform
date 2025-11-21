// src/services/expertService.js
import api from './api';

const expertService = {
  // Dashboard
  getDashboard: async () => {
    const data = await api.expert.getDashboard();
    return data;
  },

  getAnalytics: async () => {
    const data = await api.expert.getAnalytics();
    return data;
  },

  // Consultations
  getConsultations: async (filters = {}) => {
    const data = await api.expert.getConsultations(filters);
    return data;
  },

  updateConsultation: async (consultationId, updates) => {
    const data = await api.expert.updateConsultation(consultationId, updates);
    return data;
  },

  provideAdvice: async (consultationId, adviceData) => {
    const data = await api.expert.provideAdvice(consultationId, adviceData);
    return data;
  },

  // Availability
  setAvailability: async (availability) => {
    const data = await api.expert.setAvailability(availability);
    return data;
  },

  // Clients
  getClients: async (filters = {}) => {
    const data = await api.expert.getClients(filters);
    return data;
  },

  // Knowledge Content
  getKnowledgeContent: async (filters = {}) => {
    const data = await api.expert.getKnowledgeContent(filters);
    return data;
  },

  createKnowledgeContent: async (contentData) => {
    const data = await api.expert.createKnowledgeContent(contentData);
    return data;
  },

  updateKnowledgeContent: async (contentId, updates) => {
    const data = await api.expert.updateKnowledgeContent(contentId, updates);
    return data;
  }
};

export default expertService;