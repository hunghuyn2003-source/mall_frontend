"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetPayments } from "@/hooks/useFinance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAYMENT_STATUS_LABEL } from "@/helper/Label";
import type { PaymentStatus } from "@/api/finance";
import { TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";

interface Props {
  onCreateNotification: () => void;
}

export default function ListPaymentTable({ onCreateNotification }: Props) {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | undefined>();
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(null);
  const [storeId, setStoreId] = useState<number | undefined>();

  const params: any = {
    page,
    limit,
    search: debouncedSearch,
    status,
    paymentMonth: paymentDate ? paymentDate.month() + 1 : undefined,
    paymentYear: paymentDate ? paymentDate.year() : undefined,
    storeId,
  };

  const { data: paymentData, isLoading } = useGetPayments(params);

  const payments = paymentData?.data || [];
  const meta = paymentData?.meta;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TextField
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Tìm theo tên cửa hàng..."
            sx={{ width: 300 }}
            size="small"
          />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Hóa đơn tháng"
              value={paymentDate}
              onChange={(newValue) => {
                setPage(1);
                setPaymentDate(newValue as Dayjs | null);
              }}
              views={["month", "year"]}
              format="MM/YYYY"
              slotProps={{
                popper: { sx: { zIndex: 9999999 } },
                textField: {
                  size: "small",
                  sx: { width: 200 },
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            select
            value={status || ""}
            onChange={(e) => {
              setPage(1);
              setStatus(
                e.target.value ? (e.target.value as PaymentStatus) : undefined,
              );
            }}
            sx={{ width: 200 }}
            size="small"
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                sx: { zIndex: 9999999 },
                PaperProps: { sx: { zIndex: 9999999 } },
              },
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="PAID">Đã thanh toán</MenuItem>
            <MenuItem value="DEBIT">Ghi nợ</MenuItem>
          </TextField>
        
        </div>
        <button
          onClick={onCreateNotification}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 whitespace-nowrap text-white hover:bg-blue-700"
        >
          Tạo thông báo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4"></div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Hóa đơn tháng
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Cửa hàng
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Số tiền
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Còn nợ
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Ngày thanh toán
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center">
                      Đang tải...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  payments.map((payment: any) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                        {payment.paymentMonth}/{payment.paymentYear}
                      </td>
                      <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                        {payment.store?.name || "___"}
                      </td>

                      <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                        {payment.amount?.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                        {payment.owed?.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                        {PAYMENT_STATUS_LABEL[payment.status] ||
                          payment.status ||
                          "___"}
                      </td>
                      <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString("vi-VN")
                          : "___"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {meta && (
        <div className="flex items-center justify-end gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-md text-gray-600">
            Trang {meta.page} / {meta.totalPages}
          </span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
