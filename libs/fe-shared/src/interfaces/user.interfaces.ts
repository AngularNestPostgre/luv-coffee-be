import { UserRole } from '../enums/user-role.enum';

export interface UserLogin {
  email: string;
  password: string;
}

export interface CreateUser extends UserLogin {
  firstName: string;
  lastName: string;
  role: UserRole;
  description: string;
}

export interface User extends CreateUser {
  id: number;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserUI = Omit<User, 'password' | 'refreshToken'>;

export interface UserUiWrapped {
  data: UserUI;
}
