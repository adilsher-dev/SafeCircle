import type { Gender, Role } from './enums';

// AuthController / dto.*

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender?: Gender;
  dateOfBirth?: string; // LocalDate -> ISO 'yyyy-MM-dd'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: number;
  fullName: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender;
  dateOfBirth?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  gender?: Gender;
  dateOfBirth?: string;
  profileImageUrl?: string;
}
