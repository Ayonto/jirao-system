import { User, Space, Interest, LoginCredentials, RegisterData, CreateSpaceData, Report, CreateReportData, AdminLoginCredentials, PendingHost } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async adminLogin(credentials: AdminLoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  // Space endpoints
  async getSpaces(location?: string): Promise<Space[]> {
    const url = new URL(`${API_BASE_URL}/spaces`);
    if (location) {
      url.searchParams.append('location', location);
    }
    
    const response = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getSpaceById(id: number): Promise<Space> {
    const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getHostSpaces(ownerId: number): Promise<Space[]> {
    const response = await fetch(`${API_BASE_URL}/spaces/host/${ownerId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // async createSpace(data: CreateSpaceData, ownerId: number): Promise<Space> {
  //   const response = await fetch(`${API_BASE_URL}/spaces`, {
  //     method: 'POST',
  //     headers: getAuthHeaders(),
  //     body: JSON.stringify(data)
  //   });
  //   return handleResponse(response);
  // },


  async createSpace(data: CreateSpaceData, ownerId: number): Promise<Space> {
  const payload = { ...data, owner_id: ownerId }; // Add owner_id into the payload

  const response = await fetch(`${API_BASE_URL}/spaces`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
  },

  async updateSpaceAvailability(spaceId: number, availability: Space['availability']): Promise<Space> {
    const response = await fetch(`${API_BASE_URL}/spaces/${spaceId}/availability`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ availability })
    });
    return handleResponse(response);
  },

  // Interest endpoints
  async expressInterest(spaceId: number, userId: number, hoursRequested?: number): Promise<Interest> {
    const response = await fetch(`${API_BASE_URL}/interests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        user_id: userId,
        space_id: spaceId,
        hours_requested: hoursRequested 
      })
    });
    return handleResponse(response);
  },

  async getUserInterests(userId: number): Promise<Interest[]> {
    const response = await fetch(`${API_BASE_URL}/interests/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getSpaceInterests(spaceId: number): Promise<Interest[]> {
    const response = await fetch(`${API_BASE_URL}/interests/space/${spaceId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async cancelInterest(interestId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/interests/${interestId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  },

  async checkUserInterest(spaceId: number, userId: number): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/interests/check/${spaceId}/${userId}`, {
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.has_interest;
  },

  // Report endpoints
  async createReport(data: CreateReportData, reporterId: number): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async getReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getUsersForReporting(currentUserId: number, targetRole: 'host' | 'guest'): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/for-reporting/${currentUserId}/${targetRole}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async banUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  },

  async unbanUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  },

  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  },

  async getPendingHosts(): Promise<PendingHost[]> {
    const response = await fetch(`${API_BASE_URL}/admin/pending-hosts`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async approveHost(pendingHostId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/approve-host/${pendingHostId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  },

  async rejectHost(pendingHostId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/reject-host/${pendingHostId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  }
};