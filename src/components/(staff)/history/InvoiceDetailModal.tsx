"use client";

import { Modal } from "@/components/ui/modal";
import { Typography } from "@mui/material";
import { Receipt, X } from "lucide-react";
import { formatDate } from "@/helper/format";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export default function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
}: Props) {
  if (!invoice) return null;


  const items = invoice.items || [];
  const total = invoice.total || invoice.totalAmount || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-600" />
          <Typography variant="h6">
            Hóa đơn #{invoice.id || invoice.code}
          </Typography>
        </div>
        <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Info */}
      <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-sm text-gray-500">Ngày tạo</p>
          <p className="font-medium text-gray-800">
            {invoice.createdAt ? formatDate(invoice.createdAt) : "___"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nhân viên</p>
          <p className="font-medium text-gray-800">
            {invoice.createdBy?.name || "___"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Số sản phẩm</p>
          <p className="font-medium text-gray-800">{items.length} sản phẩm</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Trạng thái</p>
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
            Hoàn thành
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4">
        <h4 className="mb-2 font-medium text-gray-800">Chi tiết sản phẩm</h4>
        <div className="rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Sản phẩm
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                  SL
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  Đơn giá
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    <div>
                      <p className="font-medium">
                        {item.product?.name || "___"}
                      </p>
                      {item.product?.code && (
                        <p className="text-xs text-gray-500">
                          {item.product.code}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-gray-600">
                    {(item.price || 0).toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-medium text-gray-800">
                    {((item.price || 0) * item.quantity).toLocaleString(
                      "vi-VN",
                    )}{" "}
                    đ
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Không có sản phẩm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
        <span className="text-lg font-medium text-gray-700">Tổng cộng:</span>
        <span className="text-xl font-bold text-blue-600">
          {total.toLocaleString("vi-VN")} đ
        </span>
      </div>
    </Modal>
  );
}
