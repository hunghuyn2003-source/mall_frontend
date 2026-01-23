"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payInvoice } from "@/api/storeInvoice";
import { Modal } from "@/components/ui/modal";
import { Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  storeId: number;
}

export default function PaymentQRModal({
  isOpen,
  onClose,
  invoice,
  storeId,
}: Props) {
  const queryClient = useQueryClient();

  const payMutation = useMutation({
    mutationFn: (invoiceId: number) => payInvoice(storeId, invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-invoices"] });
      toast.success("Thanh toán hóa đơn thành công");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi thanh toán");
    },
  });

  const handleConfirmPayment = () => {
    payMutation.mutate(invoice.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <Typography variant="h6" mb={2} textAlign="center">
        Thanh toán hóa đơn
      </Typography>

      <div className="mb-4 text-center">
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Mã hóa đơn: <span className="font-semibold">{invoice.invoiceCode}</span>
        </p>
        <p className="text-lg font-bold text-blue-600">
          Tổng tiền: {Number(invoice.totalAmount).toLocaleString("vi-VN")} đ
        </p>
      </div>

      <div className="mb-4 flex justify-center">
        <img
          src="/images/QR.jpg"
          alt="QR Code thanh toán"
          className="h-auto w-full max-w-[300px] rounded-lg border border-gray-200"
        />
      </div>

      <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Vui lòng quét mã QR để thanh toán, sau đó nhấn xác nhận
      </p>

      <Button
        onClick={handleConfirmPayment}
        variant="contained"
        fullWidth
        disabled={payMutation.isPending}
        sx={{
          backgroundColor: "#16A34A",
          borderRadius: 2,
          "&:hover": {
            backgroundColor: "#15803D",
          },
          "&:disabled": {
            backgroundColor: "#9CA3AF",
          },
        }}
      >
        {payMutation.isPending ? "Đang xử lý..." : "Xác nhận thanh toán"}
      </Button>
    </Modal>
  );
}
