// services/api.ts (add resendOtp if missing, but assuming it's there; full class for completeness)
const GO_BASE_URL = import.meta.env.VITE_GO_API_URL || 'http://localhost:8080';
const NODE_BASE_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request(baseUrl: string, endpoint: string, options: RequestInit = {}) {
    const url = `${baseUrl}${endpoint}`;
    const config: RequestInit = {
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
        const errData = data; // Assuming JSON error
        throw new Error(errData.error || errData.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async authRequest(baseUrl: string, endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Auth Request Headers:', headers);

    return this.request(baseUrl, endpoint, {
      ...options,
      headers,
    });
  }

  // AUTH (Node Backend)
  async signup(phoneNumber: string, referralCode?: string) {
    return this.request(NODE_BASE_URL, '/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, referralCode }),
    });
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    return this.request(NODE_BASE_URL, '/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
  }

  async requestLoginOtp(emailOrPhone: string) {
    return this.request(NODE_BASE_URL, '/auth/request-login-otp', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone }),
    });
  }

  async verifyLoginOtp(emailOrPhone: string, otp: string) {
    return this.request(NODE_BASE_URL, '/auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, otp }),
    });
  }

  async resendOtp(phoneNumber: string) {
    return this.request(NODE_BASE_URL, '/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async setupProfile(profileData: {
    fullName: string;
    email: string;
    dob: string;
    address: string;
    city: string;
    state: string;
  }) {
    console.log('Setup Profile Data:', profileData);

    return this.authRequest(NODE_BASE_URL, '/user/setup-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async uploadKyc(kycData: { docType: string; fileUrl: string }) {
    return this.authRequest(NODE_BASE_URL, '/user/upload-kyc', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async getProfile() {
    return this.authRequest(NODE_BASE_URL, '/user/profile', {
      method: 'GET',
    });
  }

  // LOANS (Go Backend)
  async applyLoan(data: { amount: number; term: number; type: string }) {
    return this.authRequest(GO_BASE_URL, '/loans/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyLoans() {
    const data = await this.authRequest(GO_BASE_URL, '/loans/user', { method: 'GET' });
    return data; // Array
  }

  async getRepayments(loanId: string) {
    return this.authRequest(GO_BASE_URL, `/repayments/${loanId}`, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();