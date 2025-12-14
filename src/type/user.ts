export interface TUser {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
}

export interface CreateOwner {
  name: string;
  email: string;
  password: string;
  phone: string;
  birth: string;
  gender: string;
  address?: string;
  avatar?: string;
}
