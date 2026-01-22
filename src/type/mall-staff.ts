export interface MallStaff {
  id: number;
  position: string;
  salary: number;
  phone: string;
  email: string;
  birth: string;
  gender: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMallStaff {
  position: string;
  salary: number;
  phone: string;
  email: string;
  birth: string;
  gender: string;
}

export interface UpdateMallStaff {
  position?: string;
  salary?: number;
  phone?: string;
  email?: string;
  birth?: string;
  gender?: string;
  isActive?: boolean;
}
