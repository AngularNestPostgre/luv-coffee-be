export enum AccessJwtKey {
  Expiration = 'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  Secret = 'JWT_ACCESS_TOKEN_SECRET',
}

export enum RefreshJwtKey {
  Expiration = 'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
  Secret = 'JWT_REFRESH_TOKEN_SECRET',
}

export enum EmailJwtKey {
  Expiration = 'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
  Secret = 'JWT_VERIFICATION_TOKEN_SECRET',
}
