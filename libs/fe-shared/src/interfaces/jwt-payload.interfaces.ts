import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  id: number;
  email: string;
  role?: UserRole;
}
