export interface Token {
  cookie: string;
  jwt: string;
}

export interface AuthTokens {
  accessToken: Token;
  refreshToken: Token;
}
