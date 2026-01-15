"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useFinanceSocket } from "@/hooks/useFinanceSocket";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCreatePayment } from "@/hooks/useFinance";
import { uploadImage } from "@/api/upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaymentStatus } from "@/type/finance";
import { TextField, Button } from "@mui/material";
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

  const rentalFees = user?.rentalFees;

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file, "stores"),
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi upload ảnh",
      );
    },
  });

  useEffect(() => {
    const savedNotification = localStorage.getItem(STORAGE_KEY);
    if (savedNotification) {
      try {
        const parsed = JSON.parse(savedNotification) as PaymentNotification;
        setNotification(parsed);
        setShowForm(false);
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (showForm && rentalFees) {
      setAmount(rentalFees.totalFee);
      setOwed(0);
      setStatus("PAID");
    }
  }, [showForm, rentalFees]);

  useEffect(() => {
    if (!rentalFees || amount === "") return;

    const paidAmount = Number(amount);
    const totalFee = rentalFees.totalFee;

    if (paidAmount < totalFee) {
      setStatus("DEBIT");
      setOwed(totalFee - paidAmount);
    } else if (paidAmount >= totalFee) {
      setStatus("PAID");
      setOwed(0);
    }
  }, [amount, rentalFees]);

  const handlePaymentNotification = useCallback(
    (notificationData: PaymentNotification) => {
      const notificationKey = `${notificationData.notificationId || ""}-${notificationData.createdAt}`;

      if (hasShownToastRef.current === notificationKey) {
        return;
      }

      hasShownToastRef.current = notificationKey;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notificationData));
      setNotification(notificationData);
      setShowForm(false);
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

    if (!rentalFees) {
      toast.error("Không tìm thấy thông tin phí thuê");
      return;
    }

    try {
      let imageUrl = "";

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
      localStorage.removeItem(STORAGE_KEY);
      setShowForm(false);
      setNotification(null);
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
        <div className="max-h-[80vh] overflow-y-auto rounded-lg border border-blue-400 bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Thanh toán hóa đơn tháng {notification.paymentMonth}/
              {notification.paymentYear}
            </h3>
          </div>

          {user?.stores && user.stores.length > 0 && (
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                Cửa hàng của bạn:
              </p>
              <div className="flex flex-wrap gap-2">
                {user.stores.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-600"
                  >
                    {s.avatar ? (
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                        {s.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {rentalFees && (
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Chi tiết phí theo cửa hàng:
                </p>
                <div className="space-y-2">
                  {rentalFees.details.map((detail) => (
                    <div
                      key={detail.storeId}
                      className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700"
                    >
                      <span className="font-medium">{detail.storeName}</span>
                      <span>
                        {(
                          detail.premisesFee + detail.serviceFee
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                  <div className="flex justify-between text-sm">
                    <span>Tổng phí mặt bằng:</span>
                    <span className="font-medium">
                      {rentalFees.totalPremisesFee.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tổng phí dịch vụ:</span>
                    <span className="font-medium">
                      {rentalFees.totalServiceFee.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-600">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {rentalFees.totalFee.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-5">
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
              />
            </div>
            <div className="mb-2">
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

            <Button
              type="submit"
              variant="contained"
              disabled={
                createPayment.isPending ||
                uploadMutation.isPending ||
                !rentalFees
              }
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
          </form>
        </div>
      )}
    </div>
  );
}
