export interface StoreInvoice {
  id: number;
  storeId: number;
  invoiceCode: string;
  monthYear: string;
  contractFee: number;
  electricityFee?: number;
  waterFee?: number;
  totalAmount: number;
  status: "PAID" | "DEBIT";
  dueDate: string;
  store?: {
    id: number;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}
