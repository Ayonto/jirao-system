import { User, Space, Interest, LoginCredentials, RegisterData, CreateSpaceData, Report, CreateReportData, AdminLoginCredentials, PendingHost } from '../types';

// Mock data storage with more extensive dummy data
let users: User[] = [
  { 
    id: 1, 
    username: 'john_guest', 
    email: 'john@example.com', 
    role: 'guest', 
    status: 'active',
    date_joined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 2, 
    username: 'sarah_host', 
    email: 'sarah@example.com', 
    role: 'host', 
    status: 'active',
    date_joined: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 3, 
    username: 'mike_host', 
    email: 'mike@example.com', 
    role: 'host', 
    status: 'active',
    date_joined: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 4, 
    username: 'admin_user', 
    email: 'admin@jirao.com', 
    role: 'admin', 
    status: 'active',
    date_joined: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 5, 
    username: 'emma_guest', 
    email: 'emma@example.com', 
    role: 'guest', 
    status: 'active',
    date_joined: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 6, 
    username: 'david_host', 
    email: 'david@example.com', 
    role: 'host', 
    status: 'active',
    date_joined: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 7, 
    username: 'lisa_guest', 
    email: 'lisa@example.com', 
    role: 'guest', 
    status: 'banned',
    date_joined: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 8, 
    username: 'alex_host', 
    email: 'alex@example.com', 
    role: 'host', 
    status: 'active',
    date_joined: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 9, 
    username: 'maria_guest', 
    email: 'maria@example.com', 
    role: 'guest', 
    status: 'active',
    date_joined: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 10, 
    username: 'tom_host', 
    email: 'tom@example.com', 
    role: 'host', 
    status: 'banned',
    date_joined: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let spaces: Space[] = [
  {
    id: 1,
    owner_id: 2,
    type: 'room',
    title: 'Cozy Downtown Room',
    location: 'Downtown NYC',
    rate_per_hour: 15.0,
    description: 'A comfortable room in the heart of the city with great amenities. Features include free WiFi, air conditioning, comfortable bed, and access to kitchen facilities. Perfect for travelers looking for a central location.',
    availability: 'available',
    owner_name: 'sarah_host'
  },
  {
    id: 2,
    owner_id: 3,
    type: 'parking',
    title: 'Secure Parking Space',
    location: 'Manhattan',
    rate_per_hour: 8.0,
    description: 'Safe and secure parking space close to subway station. 24/7 surveillance, covered parking, and easy access. Perfect for daily commuters or visitors to the area.',
    availability: 'available',
    owner_name: 'mike_host',
    dimensions: {
      length: 20,
      width: 10,
      height: 8
    }
  },
  {
    id: 3,
    owner_id: 2,
    type: 'room',
    title: 'Modern Studio Apartment',
    location: 'Brooklyn',
    rate_per_hour: 20.0,
    description: 'Fully furnished modern studio with kitchen and bathroom. Recently renovated with modern appliances, high-speed internet, and great natural light. Quiet neighborhood with easy transportation access.',
    availability: 'on_hold',
    owner_name: 'sarah_host'
  },
  {
    id: 4,
    owner_id: 3,
    type: 'parking',
    title: 'Airport Parking',
    location: 'Queens',
    rate_per_hour: 5.0,
    description: 'Convenient parking near JFK airport with shuttle service. Long-term parking available with discount rates. Secure facility with regular patrols.',
    availability: 'available',
    owner_name: 'mike_host',
    dimensions: {
      length: 18,
      width: 9,
      height: 7
    }
  },
  {
    id: 5,
    owner_id: 2,
    type: 'room',
    title: 'Luxury Penthouse Room',
    location: 'Upper East Side',
    rate_per_hour: 35.0,
    description: 'Premium room in luxury penthouse with city views. High-end amenities, rooftop access, gym, and concierge services. Perfect for business travelers or special occasions.',
    availability: 'not_available',
    owner_name: 'sarah_host'
  },
  {
    id: 6,
    owner_id: 6,
    type: 'room',
    title: 'Artistic Loft Space',
    location: 'SoHo',
    rate_per_hour: 25.0,
    description: 'Creative loft space in the heart of SoHo. High ceilings, exposed brick walls, and plenty of natural light. Perfect for artists, photographers, or anyone looking for a unique space.',
    availability: 'available',
    owner_name: 'david_host'
  },
  {
    id: 7,
    owner_id: 6,
    type: 'parking',
    title: 'Underground Garage Spot',
    location: 'Midtown',
    rate_per_hour: 12.0,
    description: 'Secure underground parking in busy Midtown area. Climate controlled, well-lit, and accessible 24/7. Perfect for business meetings or shopping trips.',
    availability: 'available',
    owner_name: 'david_host',
    dimensions: {
      length: 22,
      width: 11,
      height: 9
    }
  },
  {
    id: 8,
    owner_id: 8,
    type: 'room',
    title: 'Cozy Brooklyn Apartment',
    location: 'Williamsburg',
    rate_per_hour: 18.0,
    description: 'Charming apartment in trendy Williamsburg. Walking distance to restaurants, cafes, and the East River. Modern amenities with a vintage touch.',
    availability: 'available',
    owner_name: 'alex_host'
  },
  {
    id: 9,
    owner_id: 8,
    type: 'parking',
    title: 'Street Level Parking',
    location: 'Brooklyn',
    rate_per_hour: 6.0,
    description: 'Convenient street-level parking spot in residential Brooklyn. Safe neighborhood with easy access to public transportation.',
    availability: 'on_hold',
    owner_name: 'alex_host',
    dimensions: {
      length: 19,
      width: 8,
      height: 7
    }
  },
  {
    id: 10,
    owner_id: 6,
    type: 'room',
    title: 'Business Meeting Room',
    location: 'Financial District',
    rate_per_hour: 40.0,
    description: 'Professional meeting room in the Financial District. Equipped with presentation screen, conference table, and high-speed internet. Perfect for business meetings.',
    availability: 'available',
    owner_name: 'david_host'
  },
  {
    id: 11,
    owner_id: 8,
    type: 'room',
    title: 'Student-Friendly Room',
    location: 'Near Columbia University',
    rate_per_hour: 12.0,
    description: 'Affordable room near Columbia University. Quiet study environment, good WiFi, and close to campus. Perfect for students or researchers.',
    availability: 'available',
    owner_name: 'alex_host'
  },
  {
    id: 12,
    owner_id: 3,
    type: 'parking',
    title: 'Event Parking Space',
    location: 'Madison Square Garden Area',
    rate_per_hour: 15.0,
    description: 'Premium parking near Madison Square Garden. Perfect for events, concerts, and sports games. Pre-booking recommended for events.',
    availability: 'not_available',
    owner_name: 'mike_host',
    dimensions: {
      length: 21,
      width: 10,
      height: 8
    }
  }
];

let interests: Interest[] = [
  {
    id: 1,
    user_id: 1,
    space_id: 1,
    hours_requested: 3,
    status: 'pending',
    host_response_date: undefined,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user_name: 'john_guest',
    user_email: 'john@example.com',
    space_title: 'Cozy Downtown Room',
    space_location: 'Downtown NYC',
    space_rate: 15.0
  },
  {
    id: 2,
    user_id: 5,
    space_id: 1,
    hours_requested: 2,
    status: 'accepted',
    host_response_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user_name: 'emma_guest',
    user_email: 'emma@example.com',
    space_title: 'Cozy Downtown Room',
    space_location: 'Downtown NYC',
    space_rate: 15.0
  },
  {
    id: 3,
    user_id: 9,
    space_id: 2,
    hours_requested: 8,
    status: 'rejected',
    host_response_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user_name: 'maria_guest',
    user_email: 'maria@example.com',
    space_title: 'Secure Parking Space',
    space_location: 'Manhattan',
    space_rate: 8.0
  },
  {
    id: 4,
    user_id: 1,
    space_id: 6,
    hours_requested: 4,
    status: 'pending',
    host_response_date: undefined,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    user_name: 'john_guest',
    user_email: 'john@example.com',
    space_title: 'Artistic Loft Space',
    space_location: 'SoHo',
    space_rate: 25.0
  },
  {
    id: 5,
    user_id: 5,
    space_id: 8,
    hours_requested: 6,
    status: 'accepted',
    host_response_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    user_name: 'emma_guest',
    user_email: 'emma@example.com',
    space_title: 'Cozy Brooklyn Apartment',
    space_location: 'Williamsburg',
    space_rate: 18.0
  },
  {
    id: 6,
    user_id: 9,
    space_id: 10,
    hours_requested: 2,
    status: 'pending',
    host_response_date: undefined,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    user_name: 'maria_guest',
    user_email: 'maria@example.com',
    space_title: 'Business Meeting Room',
    space_location: 'Financial District',
    space_rate: 40.0
  }
];

let reports: Report[] = [
  {
    id: 1,
    reporter_id: 1,
    reported_id: 2,
    reporter_role: 'guest',
    reported_role: 'host',
    reason: 'Host was unresponsive and the room was not as described in the listing. (Listing: Cozy Downtown Room)',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporter_name: 'john_guest',
    reported_name: 'sarah_host',
    reporter_email: 'john@example.com',
    reported_email: 'sarah@example.com'
  },
  {
    id: 2,
    reporter_id: 5,
    reported_id: 3,
    reporter_role: 'guest',
    reported_role: 'host',
    reason: 'Parking space was occupied by another vehicle when I arrived. Host did not resolve the issue promptly. (Listing: Secure Parking Space)',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporter_name: 'emma_guest',
    reported_name: 'mike_host',
    reporter_email: 'emma@example.com',
    reported_email: 'mike@example.com'
  },
  {
    id: 3,
    reporter_id: 2,
    reported_id: 9,
    reporter_role: 'host',
    reported_role: 'guest',
    reason: 'Guest left the room in poor condition and was disrespectful during communication.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reporter_name: 'sarah_host',
    reported_name: 'maria_guest',
    reporter_email: 'sarah@example.com',
    reported_email: 'maria@example.com'
  },
  {
    id: 4,
    reporter_id: 9,
    reported_id: 6,
    reporter_role: 'guest',
    reported_role: 'host',
    reason: 'Host cancelled last minute without proper notice, causing inconvenience. (Listing: Artistic Loft Space)',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reporter_name: 'maria_guest',
    reported_name: 'david_host',
    reporter_email: 'maria@example.com',
    reported_email: 'david@example.com'
  }
];

let pendingHosts: PendingHost[] = [
  {
    id: 1,
    username: 'pending_host_1',
    email: 'pending1@example.com',
    nid_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    date_applied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    username: 'pending_host_2',
    email: 'pending2@example.com',
    nid_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    date_applied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    username: 'pending_host_3',
    email: 'pending3@example.com',
    nid_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    date_applied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let nextUserId = users.length + 1;
let nextSpaceId = spaces.length + 1;
let nextInterestId = interests.length + 1;
let nextReportId = reports.length + 1;
let nextPendingHostId = pendingHosts.length + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(1000);
    
    const user = users.find(u => u.username === credentials.username);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // In real implementation, verify password hash
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    
    return { user, token };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await delay(1000);
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === data.username || u.email === data.email);
    if (existingUser) {
      throw new Error('Username or email already exists');
    }
    
    // If registering as host, create pending host entry
    if (data.role === 'host') {
      const pendingHost: PendingHost = {
        id: nextPendingHostId++,
        username: data.username,
        email: data.email,
        nid_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        date_applied: new Date().toISOString()
      };
      pendingHosts.push(pendingHost);
      throw new Error('Host application submitted. Please wait for admin approval.');
    }
    
    const newUser: User = {
      id: nextUserId++,
      username: data.username,
      email: data.email,
      role: data.role,
      status: 'active',
      date_joined: new Date().toISOString()
    };
    
    users.push(newUser);
    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
    
    return { user: newUser, token };
  },

  // Admin auth endpoints
  async adminLogin(credentials: AdminLoginCredentials): Promise<{ user: User; token: string }> {
    await delay(1000);
    
    const user = users.find(u => u.username === credentials.username && u.role === 'admin');
    if (!user) {
      throw new Error('Invalid admin credentials');
    }
    
    if (user.status === 'banned') {
      throw new Error('Account is banned');
    }
    
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    return { user, token };
  },

  // Space endpoints
  async getSpaces(location?: string): Promise<Space[]> {
    await delay(500);
    
    let filteredSpaces = spaces.filter(space => space.availability === 'available');
    
    if (location && location.trim()) {
      filteredSpaces = filteredSpaces.filter(space => 
        space.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return filteredSpaces;
  },

  async getSpaceById(id: number): Promise<Space> {
    await delay(300);
    
    const space = spaces.find(s => s.id === id);
    if (!space) {
      throw new Error('Space not found');
    }
    
    return space;
  },

  async getHostSpaces(ownerId: number): Promise<Space[]> {
    await delay(500);
    
    return spaces.filter(space => space.owner_id === ownerId);
  },

  async createSpace(data: CreateSpaceData, ownerId: number): Promise<Space> {
    await delay(800);
    
    const owner = users.find(u => u.id === ownerId);
    const newSpace: Space = {
      id: nextSpaceId++,
      owner_id: ownerId,
      owner_name: owner?.username,
      ...data
    };
    
    spaces.push(newSpace);
    return newSpace;
  },

  async updateSpace(spaceId: number, data: any): Promise<Space> {
    await delay(800);
    
    const spaceIndex = spaces.findIndex(s => s.id === spaceId);
    if (spaceIndex === -1) {
      throw new Error('Space not found');
    }
    
    // Update space with new data
    spaces[spaceIndex] = {
      ...spaces[spaceIndex],
      ...data,
      id: spaceId // Ensure ID doesn't change
    };
    
    return spaces[spaceIndex];
  },

  async updateSpaceAvailability(spaceId: number, availability: Space['availability']): Promise<Space> {
    await delay(500);
    
    const spaceIndex = spaces.findIndex(s => s.id === spaceId);
    if (spaceIndex === -1) {
      throw new Error('Space not found');
    }
    
    spaces[spaceIndex].availability = availability;
    return spaces[spaceIndex];
  },

  // Interest endpoints
  async expressInterest(spaceId: number, userId: number, hoursRequested?: number): Promise<Interest> {
    await delay(500);
    
    // Check if already interested
    const existingInterest = interests.find(i => i.user_id === userId && i.space_id === spaceId);
    if (existingInterest) {
      throw new Error('You have already expressed interest in this space');
    }
    
    const user = users.find(u => u.id === userId);
    const space = spaces.find(s => s.id === spaceId);
    
    const newInterest: Interest = {
      id: nextInterestId++,
      user_id: userId,
      space_id: spaceId,
      hours_requested: hoursRequested,
      status: 'pending',
      host_response_date: undefined,
      timestamp: new Date().toISOString(),
      user_name: user?.username,
      user_email: user?.email,
      space_title: space?.title,
      space_location: space?.location,
      space_rate: space?.rate_per_hour
    };
    
    interests.push(newInterest);
    return newInterest;
  },

  async getUserInterests(userId: number): Promise<Interest[]> {
    await delay(400);
    
    return interests.filter(interest => interest.user_id === userId).map(interest => {
      const space = spaces.find(s => s.id === interest.space_id);
      return {
        ...interest,
        space_title: space?.title,
        space_location: space?.location,
        space_rate: space?.rate_per_hour
      };
    });
  },

  async getSpaceInterests(spaceId: number): Promise<Interest[]> {
    await delay(400);
    
    return interests.filter(interest => interest.space_id === spaceId).map(interest => {
      const user = users.find(u => u.id === interest.user_id);
      return {
        ...interest,
        user_name: user?.username,
        user_email: user?.email
      };
    });
  },

  async cancelInterest(interestId: number): Promise<void> {
    await delay(400);
    
    const interestIndex = interests.findIndex(i => i.id === interestId);
    if (interestIndex === -1) {
      throw new Error('Interest not found');
    }
    
    interests.splice(interestIndex, 1);
  },

  async checkUserInterest(spaceId: number, userId: number): Promise<boolean> {
    await delay(200);
    
    return interests.some(i => i.space_id === spaceId && i.user_id === userId);
  },

  async respondToInterest(interestId: number, status: 'accepted' | 'rejected'): Promise<Interest> {
    await delay(500);
    
    const interestIndex = interests.findIndex(i => i.id === interestId);
    if (interestIndex === -1) {
      throw new Error('Interest not found');
    }
    
    interests[interestIndex].status = status;
    interests[interestIndex].host_response_date = new Date().toISOString();
    
    // Get updated interest with all details
    const interest = interests[interestIndex];
    const user = users.find(u => u.id === interest.user_id);
    const space = spaces.find(s => s.id === interest.space_id);
    
    return {
      ...interest,
      user_name: user?.username,
      user_email: user?.email,
      space_title: space?.title,
      space_location: space?.location,
      space_rate: space?.rate_per_hour
    };
  },
  // Report endpoints
  async createReport(data: CreateReportData, reporterId: number): Promise<Report> {
    await delay(500);
    
    const reporter = users.find(u => u.id === reporterId);
    const reported = users.find(u => u.id === data.reported_id);
    
    if (!reporter || !reported) {
      throw new Error('User not found');
    }
    
    let spaceInfo = '';
    if (data.space_id) {
      const space = spaces.find(s => s.id === data.space_id);
      if (space) {
        spaceInfo = ` (Listing: ${space.title})`;
      }
    }
    
    const newReport: Report = {
      id: nextReportId++,
      reporter_id: reporterId,
      reported_id: data.reported_id,
      reporter_role: reporter.role as 'guest' | 'host',
      reported_role: reported.role as 'host' | 'guest',
      reason: data.reason + spaceInfo,
      timestamp: new Date().toISOString(),
      reporter_name: reporter.username,
      reported_name: reported.username,
      reporter_email: reporter.email,
      reported_email: reported.email
    };
    
    reports.push(newReport);
    return newReport;
  },

  async getReports(): Promise<Report[]> {
    await delay(400);
    return reports;
  },

  async getUsersForReporting(currentUserId: number, targetRole: 'host' | 'guest'): Promise<User[]> {
    await delay(300);
    return users.filter(u => u.role === targetRole && u.id !== currentUserId && u.status === 'active');
  },

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    await delay(500);
    return users.filter(u => u.role !== 'admin');
  },

  async banUser(userId: number): Promise<void> {
    await delay(500);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex].status = 'banned';
  },

  async unbanUser(userId: number): Promise<void> {
    await delay(500);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex].status = 'active';
  },

  async deleteUser(userId: number): Promise<void> {
    await delay(500);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Remove user from users array
    users.splice(userIndex, 1);
    
    // Clean up related data
    spaces = spaces.filter(s => s.owner_id !== userId);
    interests = interests.filter(i => i.user_id !== userId);
    reports = reports.filter(r => r.reporter_id !== userId && r.reported_id !== userId);
  },

  async getPendingHosts(): Promise<PendingHost[]> {
    await delay(400);
    return pendingHosts;
  },

  async approveHost(pendingHostId: number): Promise<void> {
    await delay(800);
    
    const pendingHostIndex = pendingHosts.findIndex(h => h.id === pendingHostId);
    if (pendingHostIndex === -1) {
      throw new Error('Pending host not found');
    }
    
    const pendingHost = pendingHosts[pendingHostIndex];
    
    // Create new user with host role
    const newUser: User = {
      id: nextUserId++,
      username: pendingHost.username,
      email: pendingHost.email,
      role: 'host',
      status: 'active',
      date_joined: new Date().toISOString(),
      nid_image: pendingHost.nid_image
    };
    
    users.push(newUser);
    pendingHosts.splice(pendingHostIndex, 1);
  },

  async rejectHost(pendingHostId: number): Promise<void> {
    await delay(500);
    
    const pendingHostIndex = pendingHosts.findIndex(h => h.id === pendingHostId);
    if (pendingHostIndex === -1) {
      throw new Error('Pending host not found');
    }
    
    pendingHosts.splice(pendingHostIndex, 1);
  }
};