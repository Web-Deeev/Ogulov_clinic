import api from '../axios';

// Все запросы клиники в одном месте
export const clinicApi = {
  getDoctors: () => api.get('clinic/doctors/'),
  getDoctorBySlug: (slug) => api.get(`clinic/doctors/${slug}/`),
  getMethods: () => api.get('clinic/methods/'),
  getMethodBySlug: (slug) => api.get(`clinic/methods/${slug}/`),
  getAwards: () => api.get('clinic/awards/'),
  getClinicGallery: () => api.get('clinic/clinic-gallery/'),
  getBannerSlides: () => api.get('clinic/banner/'),
  getClinicAbout: () => api.get('clinic/clinic-info/'),
  createLead: (data) => api.post('clinic/leads/', data),
  
};
