export interface CreateStore {
  ownerId: number;
  areaId: number;

  name: string;
  type: string;

  startDate: string;
  endDate: string;
  premisesFee: number;

  serviceFee?: number;
  contractFile?: string;
}
