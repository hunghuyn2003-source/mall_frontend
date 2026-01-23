"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { listRental } from "@/api/rental";
import { ChevronLeft, ChevronRight, Edit, FileText } from "lucide-react";
import { RENTAL_STATUS_LABEL } from "@/helper/Label";
import { formatDate } from "@/helper/format";
import { Chip } from "@mui/material";
import CreateInvoiceModal from "./CreateInvoiceModal";

interface Props {
  onEdit: (rental: any) => void;
}

export default function ListRentalTable({ onEdit }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [invoiceModal, setInvoiceModal] = useState<{
    isOpen: boolean;
    storeId: number | null;
    storeName: string;
  }>({
    isOpen: false,
    storeId: null,
    storeName: "",
  });

  const { data: rentalData } = useQuery({
    queryKey: ["rentals", page, debouncedSearch],
    queryFn: () => listRental({ page, limit, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const rentals = rentalData?.data || [];
  const meta = rentalData?.meta;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Tìm theo mã hợp đồng, tên cửa hàng..."
          className="text-md w-[300px] rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Mã hợp đồng
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Vị trí
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Cửa hàng
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Chủ sở hữu
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Ngày đăng ký
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Ngày hết hạn
                  </th>

                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {rentals.map((rental: any) => (
                  <tr
                    key={rental.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => onEdit(rental)}
                  >
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {rental.code || "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                {rental.area?.code || "___"}{" "}
{rental.area?.floor?.level != null
  ? `| Tầng ${rental.area.floor.level}`
  : ""}

                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {rental.store?.name || "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {rental.owner?.name || "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {formatDate(rental.startDate)}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {formatDate(rental.endDate)}
                    </td>

                    
                    <td className="text-md px-5 py-3">
                      {RENTAL_STATUS_LABEL[rental.status] ? (
                        <Chip
                          label={RENTAL_STATUS_LABEL[rental.status].label}
                          color={RENTAL_STATUS_LABEL[rental.status].color}
                          size="small"
                          variant="filled"
                        />
                      ) : (
                        <span className="text-gray-400">___</span>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(rental);
                          }}
                          className="flex items-center gap-1 rounded bg-blue-600 px-1 py-1 text-xs text-white hover:bg-blue-700"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInvoiceModal({
                              isOpen: true,
                              storeId: rental.store?.id || null,
                              storeName: rental.store?.name || "",
                            });
                          }}
                          className="flex items-center gap-1 rounded bg-green-600 px-1 py-1 text-xs text-white hover:bg-green-700"
                          title="Tạo hóa đơn"
                        >
                          <FileText size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-md text-gray-600">
          Trang {meta?.page} / {meta?.totalPages}
        </span>
        <button
          disabled={page === meta?.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {invoiceModal.isOpen && invoiceModal.storeId && (
        <CreateInvoiceModal
          isOpen={invoiceModal.isOpen}
          onClose={() =>
            setInvoiceModal({ isOpen: false, storeId: null, storeName: "" })
          }
          storeId={invoiceModal.storeId}
          storeName={invoiceModal.storeName}
        />
      )}
    </div>
  );
}
