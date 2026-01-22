import dayjs from "dayjs";

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD/MM/YYYY");
};

export const formatNumber = (value: number | string) => {
  if (value === "" || value === null || value === undefined) return "";
  return Number(value).toLocaleString("vi-VN");
};
