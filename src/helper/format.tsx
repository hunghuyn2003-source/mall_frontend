import dayjs from "dayjs";

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD/MM/YYYY");
};

export const formatNumber = (value: number | string) => {
  if (value === "" || value === null || value === undefined) return "";
  return Number(value).toLocaleString("vi-VN");
};

export const formatMonthYear = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
