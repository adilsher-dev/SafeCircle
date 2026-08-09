// Mirrors com.safecircle.backend.dto.ApiResponse<T> and ErrorResponse

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

/** Backend @Valid failures return a flat field->message map, not ApiResponse */
export type ValidationErrorMap = Record<string, string>;
