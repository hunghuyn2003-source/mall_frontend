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
  rentalFees?: RentalFees; // Chỉ có cho STOREOWNER
}

export interface TUserStore {
  id: number;
  name: string;
  type: string;
  avatar: string | null;
  role: "OWNER" | "STAFF";
  position: string | null;
  premisesFee?: number; // Phí mặt bằng (chỉ cho STOREOWNER)
  serviceFee?: number; // Phí dịch vụ (chỉ cho STOREOWNER)
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
