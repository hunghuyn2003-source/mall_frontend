"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { listStore } from "@/api/store";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { STORE_TYPE_LABEL } from "@/helper/Label";

interface Props {
  onEdit: (store: any) => void;
}

export default function ListStoreTable({ onEdit }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: storeData } = useQuery({
    queryKey: ["stores", page, debouncedSearch],
    queryFn: () => listStore({ page, limit, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const stores = storeData?.data || [];
  const meta = storeData?.meta;

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
          placeholder="Tìm theo tên cửa hàng"
          className="text-md w-[300px] rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Tên cửa hàng
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Chủ sở hữu
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Loại
                  </th>

                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {stores.map((store: any) => (
                  <tr
                    key={store.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => onEdit(store)}
                  >
                    <td className="text-md flex gap-3 px-5 py-3 text-gray-800 dark:text-white">
                      <div>
                        {store.avatar ? (
                          <img
                            src={store.avatar}
                            alt={store.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                            {store.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">{store.name || "___"}</div>
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {store.members[0]?.user?.name || "_"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {STORE_TYPE_LABEL[store.type] || "___"}
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
    </div>
  );
}
