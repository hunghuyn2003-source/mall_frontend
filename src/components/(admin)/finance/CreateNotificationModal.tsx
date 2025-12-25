"use client";

import { useState } from "react";
import { useCreatePaymentNotification } from "@/hooks/useFinance";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateNotificationModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(
    dayjs().startOf("month"),
  );

  const createNotification = useCreatePaymentNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDate) {
      toast.error("Vui lòng chọn tháng và năm");
      return;
    }

    try {
      await createNotification.mutateAsync({
        title,
        message,
        paymentMonth: paymentDate.month() + 1, // dayjs month is 0-indexed
        paymentYear: paymentDate.year(),
      });

      toast.success("Đã tạo thông báo và gửi đến tất cả STOREOWNER!");
      // Reset form
      setTitle("");
      setMessage("");
      setPaymentDate(dayjs().startOf("month"));
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Tạo thông báo hóa đơn</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <DatePicker
                label="Hóa đơn cho tháng"
                value={paymentDate}
                onChange={(newValue) => setPaymentDate(newValue as Dayjs)}
                views={["month", "year"]}
                format="MM/YYYY"
                slotProps={{
                  popper: { sx: { zIndex: 9999999 } },
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Nội dung"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              placeholder="Vui lòng thanh toán tiền thuê tháng 12/2024"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outlined"
              sx={{
                borderColor: "#D1D5DB",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9CA3AF",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createNotification.isPending}
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
              {createNotification.isPending ? "Đang tạo..." : "Gửi thông báo "}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
