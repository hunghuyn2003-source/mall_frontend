"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useFinanceSocket } from "@/hooks/useFinanceSocket";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCreatePayment } from "@/hooks/useFinance";
import { uploadImage } from "@/api/upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { PaymentStatus } from "@/api/finance";
import { TextField, MenuItem, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

interface PaymentNotification {
  title: string;
  message: string;
  paymentMonth: number;
  paymentYear: number;
  notificationId?: number;
  createdAt: string;
}

const STORAGE_KEY = "payment_notification";

export default function PaymentNotificationHandler() {
  const [notification, setNotification] = useState<PaymentNotification | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [owed, setOwed] = useState<number>(0);
  const [status, setStatus] = useState<PaymentStatus>("PAID");
  const [paidAt, setPaidAt] = useState<dayjs.Dayjs | null>(dayjs());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const store = useSelector((state: RootState) => state.store.activeStore);
  const user = useSelector((state: RootState) => state.auth.user);
  const createPayment = useCreatePayment();
  const hasShownToastRef = useRef<string>("");

  // Lấy phí mặt bằng và phí dịch vụ cho store hiện tại
  const currentStoreFees = useMemo(() => {
    if (!user?.rentalFees?.details || !store) return null;
    const storeFee = user.rentalFees.details.find(
      (detail) => detail.storeId === store.id,
    );
    if (!storeFee) return null;
    return {
      premisesFee: storeFee.premisesFee,
      serviceFee: storeFee.serviceFee,
      totalFee: storeFee.premisesFee + storeFee.serviceFee,
    };
  }, [user?.rentalFees, store]);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file, "stores"),
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi upload ảnh",
      );
    },
  });

  // Load notification from localStorage on mount
  useEffect(() => {
    const savedNotification = localStorage.getItem(STORAGE_KEY);
    if (savedNotification) {
      try {
        const parsed = JSON.parse(savedNotification) as PaymentNotification;
        setNotification(parsed);
        setShowForm(false); // Hiển thị banner, không tự động mở form
      } catch (error) {
        console.error("Error parsing saved notification:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Auto fill số tiền thanh toán khi mở form
  useEffect(() => {
    if (showForm && currentStoreFees) {
      setAmount(currentStoreFees.totalFee);
      setOwed(0);
      setStatus("PAID");
    }
  }, [showForm, currentStoreFees]);

  // Tự động tính status và owed khi số tiền thanh toán thay đổi
  useEffect(() => {
    if (!currentStoreFees || amount === "") return;

    const paidAmount = Number(amount);
    const totalFee = currentStoreFees.totalFee;

    if (paidAmount < totalFee) {
      setStatus("DEBIT");
      setOwed(totalFee - paidAmount);
    } else if (paidAmount >= totalFee) {
      setStatus("PAID");
      setOwed(0);
    }
  }, [amount, currentStoreFees]);

  const handlePaymentNotification = useCallback(
    (notification: PaymentNotification) => {
      const notificationKey = `${notification.notificationId || ""}-${notification.createdAt}`;

      if (hasShownToastRef.current === notificationKey) {
        return;
      }

      hasShownToastRef.current = notificationKey;

      // Lưu vào localStorage để persist khi refresh
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notification));

      setNotification(notification);
      setShowForm(false); // Hiển thị banner, không tự động mở form
    },
    [],
  );

  useFinanceSocket(handlePaymentNotification);

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

    if (!currentStoreFees) {
      toast.error("Không tìm thấy thông tin phí thuê");
      return;
    }

    try {
      let imageUrl = "";

      // Upload ảnh nếu có
      if (imageFile) {
        const uploadResult = await uploadMutation.mutateAsync(imageFile);
        imageUrl = uploadResult.url;
      }

      await createPayment.mutateAsync({
        storeId: store.id,
        paymentMonth: notification!.paymentMonth,
        paymentYear: notification!.paymentYear,
        amount: Number(amount) || 0,
        owed,
        status,
        paidAt: paidAt?.toISOString() || new Date().toISOString(),
        image: imageUrl || undefined,
      });

      toast.success("Thanh toán thành công!");

      // Xóa notification và localStorage khi thành công
      localStorage.removeItem(STORAGE_KEY);
      setShowForm(false);
      setNotification(null);

      // Reset form
      setAmount("");
      setOwed(0);
      setStatus("PAID");
      setPaidAt(dayjs());
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  if (!notification) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-full max-w-md">
      {!showForm && (
        <div className="rounded-lg border border-blue-400 bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
              🔔 {notification.title} {notification.paymentMonth}/
              {notification.paymentYear}
            </h3>
            <p className="mb-2 text-sm text-blue-800 dark:text-blue-200">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Thanh toán ngay
          </button>
        </div>
      )}

      {showForm && (
        <div className="rounded-lg border border-blue-400 bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Thanh toán hóa đơn tháng {notification.paymentMonth}/
              {notification.paymentYear}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-4">
              {currentStoreFees && (
                <div className="flex flex-col gap-4">
                  <TextField
                    label="Phí mặt bằng (Không được thay đổi)"
                    value={currentStoreFees.premisesFee.toLocaleString("vi-VN")}
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                  />

                  <TextField
                    label="Phí dịch vụ (Không được thay đổi)"
                    value={currentStoreFees.serviceFee.toLocaleString("vi-VN")}
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                  />
                </div>
              )}

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
                inputProps={{ min: 0 }}
              />

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
                    },
                  }}
                />
              </LocalizationProvider>
              <div className="mb-4">
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
            </div>

            <Button
              type="submit"
              variant="contained"
              disabled={
                createPayment.isPending ||
                uploadMutation.isPending ||
                !currentStoreFees
              }
              fullWidth
              sx={{
                backgroundColor: "#2563EB",
                "&:hover": {
                  backgroundColor: "#1D4ED8",
                },
                "&:disabled": {
                  backgroundColor: "#9CA3AF",
                },
              }}
            >
              {createPayment.isPending || uploadMutation.isPending
                ? "Đang xử lý..."
                : "Thanh toán"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
