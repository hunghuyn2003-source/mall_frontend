"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCreatePayment } from "@/hooks/useFinance";
import { uploadImage } from "@/api/upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { X } from "lucide-react";

interface Payment {
  id: number;
  storeId: number;
  paymentMonth: number;
  paymentYear: number;
  amount: number;
  owed: number;
  status: string;
  paidAt: string;
  image?: string;
  createdAt: string;
}

interface PaymentDebitFormProps {
  payment: Payment;
  onClose: () => void;
}

export default function PaymentDebitForm({
  payment,
  onClose,
}: PaymentDebitFormProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [paidAt, setPaidAt] = useState<dayjs.Dayjs | null>(dayjs());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const store = useSelector((state: RootState) => state.store.activeStore);
  const createPayment = useCreatePayment();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file, "stores"),
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi upload ảnh",
      );
    },
  });

  useEffect(() => {
    setAmount(payment.owed);
  }, [payment]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!store) {
      toast.error("Vui lòng chọn cửa hàng");
      return;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        const uploadResult = await uploadMutation.mutateAsync(imageFile);
        imageUrl = uploadResult.url;
      }

      const paidAmount = Number(amount) || 0;
      let status = "PAID";
      let owed = 0;

      if (paidAmount < payment.owed) {
        status = "DEBIT";
        owed = payment.owed - paidAmount;
      }

      await createPayment.mutateAsync({
        storeId: store.id,
        paymentMonth: payment.paymentMonth,
        paymentYear: payment.paymentYear,
        amount: paidAmount,
        owed,
        status: status as "PAID" | "DEBIT",
        paidAt: paidAt?.toISOString() || new Date().toISOString(),
        image: imageUrl || undefined,
      });

      toast.success("Thanh toán thành công!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Thanh toán ghi nợ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            Chi tiết thanh toán:
          </p>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <p>
              Hóa đơn tháng:{" "}
              <span className="font-medium">
                {payment.paymentMonth}/{payment.paymentYear}
              </span>
            </p>
            <p>
              Còn nợ:{" "}
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {payment.owed.toLocaleString("vi-VN")} đ
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
              label="Số tiền thanh toán"
              fullWidth
              value={
                amount === "" ? "" : Number(amount).toLocaleString("vi-VN")
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setAmount(raw === "" ? "" : Number(raw));
              }}
              required
              size="small"
              helperText={`Cần thanh toán: ${payment.owed.toLocaleString("vi-VN")} đ`}
            />
          </div>

          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày thanh toán"
                value={paidAt}
                onChange={(newValue) =>
                  setPaidAt(newValue as dayjs.Dayjs | null)
                }
                slotProps={{
                  popper: { sx: { zIndex: 9999999 } },
                  textField: {
                    fullWidth: true,
                    required: true,
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ảnh thanh toán
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-full rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="contained"
              disabled={createPayment.isPending || uploadMutation.isPending}
              fullWidth
              sx={{
                backgroundColor: "#2563EB",
                "&:hover": { backgroundColor: "#1D4ED8" },
                "&:disabled": { backgroundColor: "#9CA3AF" },
              }}
            >
              {createPayment.isPending || uploadMutation.isPending
                ? "Đang xử lý..."
                : "Thanh toán"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              fullWidth
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
