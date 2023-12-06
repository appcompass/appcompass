export type ValidationMessage = {
  target: Record<string, unknown>;
  value: unknown;
  property: unknown;
  children: unknown[];
  constraints: Record<string, string>;
};

interface ErrorMessage {
  target: Record<string, unknown>;
  value: unknown;
  property: unknown;
  children: unknown[];
  constraints: Record<string, string>;
}

export interface ApiError<S = number, M = ErrorMessage[], R = string> {
  statusCode: S;
  message: M;
  error: R;
}

export interface UiError {
  type: string;
  message: string;
}

export type ValidationError = ApiError<422, ValidationMessage[], 'ValidationError'>;
