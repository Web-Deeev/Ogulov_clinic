import api from '../axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('ogulov_clinic_token');
  return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
};

export const userService = {
  // 1. БОЕВОЙ ВХОД: Передаем очищенный телефон в ключе username под кастомный UserLoginView
  async loginUser(credentials) {
    const response = await api.post('users/login/', {
      username: credentials.username, 
      password: credentials.password
    });
    return response.data;
  },

  // 2. БОЕВАЯ РЕГИСТРАЦИЯ: PATCH запрос Сеньор-обхода гостевой сессии на users/profile/
  async registerUser(registerData) {
    const response = await api.patch('users/profile/', {
      username: registerData.username,
      password: registerData.password,
      email: registerData.email || registerData.regEmail || '',
      first_name: registerData.firstName || registerData.first_name || '',
      last_name: registerData.lastName || registerData.last_name || '',
      phone: registerData.phone || '',
      address: registerData.address || ''
    });
    return response.data; 
  },

  async updateUserProfile(profileData) {
    const response = await api.patch('users/profile/', profileData, getAuthHeader());
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('users/change-password/', {
      old_password: passwordData.old_password,
      new_password: passwordData.new_password
    }, getAuthHeader());
    return response.data;
  }
};

export default userService;
