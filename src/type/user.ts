export interface RentalFeeDetail {
  id: number;
  storeId: number;
  storeName: string;
  premisesFee: number;
  serviceFee: number;
}

export interface RentalFees {
  totalPremisesFee: number;
  totalServiceFee: number;
  totalFee: number;
  details: RentalFeeDetail[];
}

export interface TUser {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "STOREOWNER" | "STORESTAFF";
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stores: TUserStore[];
  rentalFees?: RentalFees;
}

export interface TUserStore {
  id: number;
  name: string;
  type: string;
  avatar: string | null;
  role: "OWNER" | "STAFF";
  position: string | null;
  premisesFee?: number;
  serviceFee?: number;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  birth: string;
  gender: string;
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
