export interface RegisterData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  city: string;
  gender: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  fullName?: string;
  email?: string;
  role?: string;
  access_token?: string;
}
