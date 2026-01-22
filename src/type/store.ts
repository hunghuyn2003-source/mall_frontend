export interface CreateStore {
  ownerId: number;
  adminId: number;
  areaId: number;

  name: string;
  type: string;

  startDate: string;
  endDate: string;
  rentalFee: number;
  environmentFee: number;
  securityFee: number;

  contractFile?: string;
  agreeTerms: boolean;
}
