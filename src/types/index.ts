// Custom type definitions
export interface ErrorResponse {
  status: string;
  message: string;
  code?: number;
}

export interface SuccessResponse {
  status: string;
  data: any;
} 