import api from '../axios';

// Все запросы клиники в одном месте
export const clinicApi = {
  getDoctors: () => api.get('clinic/doctors/'),
  getDoctorBySlug: (slug) => api.get(`clinic/doctors/${slug}/`),
  getMethods: () => api.get('clinic/methods/'),
  getMethodBySlug: (slug) => api.get(`clinic/methods/${slug}/`),
};
