export interface AppConfig {
  SERVICE_NAME: string;
  SERVICE_PORT: number;
  APP_TITLE: string;
  HEADER_LOGO_URL: string;
  LOGIN_LOGO_URL: string;
  COPYRIGHT_TEXT: string;
  SHOW_BUILT_WITH: true;
  SERVICES: Array<{ name: string; api_url: string }>;
  [key: string]: string | number | boolean | unknown[];
}

export interface UserLoginResponse {
  accessToken: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
}
