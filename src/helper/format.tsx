export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

    });
};
  

export const formatNumber = (value: number | string) => {
  if (value === "" || value === null || value === undefined) return "";
  return Number(value).toLocaleString("vi-VN");
};


