import { apiClient } from './client';
import type { ApiResponse, RiskPredictionRequest, RiskPredictionResponse } from '@/types';

// Mirrors AIRiskPredictionController (/api/ai)
export const aiApi = {
  predictRisk: (payload: RiskPredictionRequest) =>
    apiClient
      .post<ApiResponse<RiskPredictionResponse>>('/ai/predict', payload)
      .then((r) => r.data),
};
