"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";

interface Props {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDetailModal({
  invoice,
  isOpen,
  onClose,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-4 text-xl font-bold">Chi tiết hóa đơn</h2>
      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Mã hóa đơn:</span>
          <span>{invoice.invoiceCode}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Tháng/Năm:</span>
          <span>{invoice.monthYear}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Phí dịch vụ:</span>
          <span>{Number(invoice.contractFee).toLocaleString("vi-VN")} ₫</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Phí điện:</span>
          <span>
            {Number(invoice.electricityFee).toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Phí nước:</span>
          <span>{Number(invoice.waterFee).toLocaleString("vi-VN")} ₫</span>
        </div>
        <div className="flex justify-between border-b pb-2 text-lg font-bold">
          <span>Tổng tiền:</span>
          <span>{Number(invoice.totalAmount).toLocaleString("vi-VN")} ₫</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Hạn thanh toán:</span>
          <span>{new Date(invoice.dueDate).toLocaleDateString("vi-VN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Trạng thái:</span>
          <span
            className={`rounded-full px-3 py-1 text-sm ${
              invoice.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {invoice.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2">
          Đóng
        </button>
      </div>
    </Modal>
  );
}
