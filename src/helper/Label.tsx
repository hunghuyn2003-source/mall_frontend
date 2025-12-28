import { Chip } from "@mui/material";

export const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Ban quản lý",
  STOREOWNER: "Chủ cửa hàng",
  STORESTAFF: "Nhân viên cửa hàng",
};

export const RENTAL_STATUS_LABEL: Record<
  string,
  { label?: string; color?: "default" | "primary" | "warning" | "error" }
> = {
  INACTIVE: { label: "Chưa hiệu lực", color: "warning" },
  ACTIVE: { label: "Có hiệu lực", color: "primary" },
  EXPIRED: { label: "Hết hạn", color: "error" },
};

export const STORE_TYPE_LABEL: Record<string, string> = {
  fashion: "Thời trang",
  food: "Ăn uống",
  electronics: "Điện tử",
  toys: "Đồ chơi",
  cosmetics: "Mỹ phẩm",
  supermarket: "Khu vui chơi",
  other: "Khác",
};

export const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PAID: "Đã thanh toán",

  DEBIT: "Ghi nợ",
};
