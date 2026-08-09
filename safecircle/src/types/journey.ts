import type { JourneyStatus, RiskLevel } from './enums';

// JourneyController
export interface JourneyRequest {
  source: string;
  destination: string;
  expectedArrivalTime: string; // LocalDateTime ISO, must be future
  transportMode: string;
  distance?: number;
  notes?: string;
  sourceLatitude?: number;
  sourceLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
}

export interface JourneyResponse {
  id: number;
  source: string;
  destination: string;
  startTime: string;
  expectedArrivalTime: string;
  endTime?: string;
  distance?: number;
  transportMode: string;
  notes?: string;
  status: JourneyStatus;
  emergencyTriggered: boolean;
  liveTrackingEnabled: boolean;
  journeyCompletedSafely: boolean;
  aiRiskPrediction?: RiskLevel;
  createdAt: string;
  updatedAt: string;
  travelledDistance?: number;
  averageSpeed?: number;
  remainingDistance?: number;
  estimatedArrivalSeconds?: number;
  offRoute?: boolean;
  sourceLatitude?: number;
  sourceLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
}

// LiveTrackingController
export interface JourneyProgressResponse {
  journeyId: number;
  source: string;
  destination: string;
  travelledDistance: number;
  remainingDistance: number;
  totalDistance: number;
  progressPercentage: number;
  averageSpeed: number;
  estimatedArrivalSeconds: number;
  currentRisk: string;
  sosTriggered: boolean;
  completed: boolean;
  currentLatitude: number;
  currentLongitude: number;
}

// LocationController
export interface LocationRequest {
  journeyId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  batteryLevel?: number;
  address?: string;
  recordedAt?: string;
  mockLocation?: boolean;
  networkType?: string;
}

export interface LocationResponse {
  id: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  batteryLevel?: number;
  address?: string;
  recordedAt: string;
  mockLocation?: boolean;
  networkType?: string;
  journeyId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// WebSocket payloads
export interface LiveLocationMessage {
  journeyId: number;
  userId: number;
  latitude: number;
  longitude: number;
  speed?: number;
  accuracy?: number;
  address?: string;
  timestamp: string;
}

export interface JourneyStatusMessage {
  journeyId: number;
  userId: number;
  status: JourneyStatus;
  source: string;
  destination: string;
  updatedAt: string;
}
