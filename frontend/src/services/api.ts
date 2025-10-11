const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async authRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    return this.request(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  // Auth endpoints
  async signup(phoneNumber: string, referralCode?: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, referralCode }),
    });
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
  }

  async login(email: string, otp: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendOtp(phoneNumber: string) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  // User endpoints
  async setupProfile(profileData: {
    fullName: string;
    email: string;
    dob: string;
    address: string;
    city: string;
    state: string;
  }) {
    return this.authRequest('/user/setup-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async uploadKyc(kycData: {
    docType: string;
    fileUrl: string;
  }) {
    return this.authRequest('/user/upload-kyc', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async getProfile() {
    return this.authRequest('/user/profile');
  }
}

export const apiService = new ApiService();