import { z } from 'zod';

// Mirrors RegisterRequest validation
export const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(20),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional(),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Mirrors LoginRequest validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().min(1),
  otp: z.string().min(1, 'OTP is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Mirrors JourneyRequest validation
export const journeySchema = z.object({
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
  expectedArrivalTime: z.string().min(1, 'Expected arrival time is required'),
  transportMode: z.string().min(1, 'Transport mode is required'),
  distance: z.number().optional(),
  notes: z.string().optional(),
  sourceLatitude: z.number().optional(),
  sourceLongitude: z.number().optional(),
  destinationLatitude: z.number().optional(),
  destinationLongitude: z.number().optional(),
});
export type JourneyFormValues = z.infer<typeof journeySchema>;

// Mirrors ContactRequest validation
export const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  relationship: z.enum([
    'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'HUSBAND', 'WIFE', 'FRIEND', 'COLLEAGUE', 'GUARDIAN', 'OTHER',
  ]),
  primaryContact: z.boolean().optional(),
});
export type ContactFormValues = z.infer<typeof contactSchema>;

// Mirrors UpdateProfileRequest validation
export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional(),
  profileImageUrl: z.string().optional(),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
