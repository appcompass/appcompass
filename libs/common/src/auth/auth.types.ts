export interface DecodedToken {
  id: string;
  email: string;
  lastLogin: string;
  sub: string;
  iat: number;
  exp: number;
}
