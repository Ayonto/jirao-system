export interface User {
  id: number;
  username: string;
  email: string;
  role: 'guest' | 'host' | 'admin';
  status: 'active' | 'banned' | 'pending';
  date_joined: string;
  nid_image?: string;
}

export interface Space {
  id: number;
  owner_id: number;
  type: 'room' | 'parking';
  title: string;
  location: string;
  rate_per_hour: number;
  description: string;
  availability: 'available' | 'on_hold' | 'not_available';
  owner_name?: string;
  // Parking-specific fields
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Interest {
  id: number;
  user_id: number;
  space_id: number;
  hours_requested?: number;
  status: 'pending' | 'accepted' | 'rejected';
  host_response_date?: string;
  timestamp: string;
  user_name?: string;
  user_email?: string;
  space_title?: string;
  space_location?: string;
  space_rate?: number;
}

export interface Report {
  id: number;
  reporter_id: number;
  reported_id: number;
  reporter_role: 'guest' | 'host';
  reported_role: 'host' | 'guest';
  reason: string;
  timestamp: string;
  reporter_name?: string;
  reported_name?: string;
  reporter_email?: string;
  reported_email?: string;
}

export interface PendingHost {
  id: number;
  username: string;
  email: string;
  nid_image: string;
  date_applied: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'guest' | 'host';
  phone?: string;
  nid_number?: string; // only required for host sign-up on the UI
}

export interface CreateSpaceData {
  type: 'room' | 'parking';
  title: string;
  location: string;
  rate_per_hour: number;
  description: string;
  availability: 'available' | 'on_hold' | 'not_available';
  // Parking-specific fields
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}


export interface UpdateSpaceData {
  title: string;
  location: string;
  rate_per_hour: number;
  description: string;
  // Parking-specific fields
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface CreateReportData {
  reported_id: number;
  space_id?: number;
  reason: string;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}