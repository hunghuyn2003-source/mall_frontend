export interface CreateStore {
  ownerId: number;
  areaId: number;

  storeName: string;
  storeType: string;

  startDate: string;
  endDate: string;
  premisesFee: number;

  serviceFee?: number;
  contractFile?: string;
}
