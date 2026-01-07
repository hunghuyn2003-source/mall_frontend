import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { listStore, getStoreDetail } from "@/api/store";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Package,
} from "lucide-react";
import { STORE_TYPE_LABEL, ROLE_LABEL } from "@/helper/Label";

interface Props {
  onEdit: (store: any) => void;
}

function StoreDetailRow({ storeId }: { storeId: number }) {
  const [membersPage, setMembersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["store-detail", storeId, membersPage, productsPage],
    queryFn: () =>
      getStoreDetail(storeId, {
        membersPage,
        membersLimit: 5,
        productsPage,
        productsLimit: 5,
      }),
  });

  if (isLoading) {
    return (
      <tr>
        <td colSpan={4} className="px-5 py-4">
          <div className="text-center text-gray-500">Đang tải...</div>
        </td>
      </tr>
    );
  }

  const members = data?.members?.data || [];
  const membersMeta = data?.members?.meta;
  const products = data?.products?.data || [];
  const productsMeta = data?.products?.meta;

  return (
    <tr>
      <td colSpan={3} className="bg-gray-50 px-5 py-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              <span className="font-medium text-gray-700">
                Nhân sự ({membersMeta?.total || 0})
              </span>
            </div>
            {members.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có Nhân sự</p>
            ) : (
              <>
                <div className="space-y-2">
                  {members.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-lg border bg-white p-2"
                    >
                      {member.user?.avatar ? (
                        <img
                          src={member.user.avatar}
                          alt={member.user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                          {member.user?.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {member.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.user?.email}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          member.role === "OWNER"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {member.role === "OWNER" ? "Chủ" : "Nhân viên"}
                      </span>
                    </div>
                  ))}
                </div>
                {membersMeta?.totalPages > 1 && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                      disabled={membersPage === 1}
                      onClick={() => setMembersPage((p) => p - 1)}
                      className="rounded bg-gray-200 p-1 disabled:opacity-50"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-gray-600">
                      {membersPage}/{membersMeta.totalPages}
                    </span>
                    <button
                      disabled={membersPage === membersMeta.totalPages}
                      onClick={() => setMembersPage((p) => p + 1)}
                      className="rounded bg-gray-200 p-1 disabled:opacity-50"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              <span className="font-medium text-gray-700">
                Sản phẩm ({productsMeta?.total || 0})
              </span>
            </div>
            {products.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có sản phẩm</p>
            ) : (
              <>
                <div className="space-y-2">
                  {products.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border bg-white p-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          Mã: {product.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">
                          {product.price?.toLocaleString("vi-VN")} đ
                        </p>
                        <p className="text-xs text-gray-500">
                          Kho: {product.stock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {productsMeta?.totalPages > 1 && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                      disabled={productsPage === 1}
                      onClick={() => setProductsPage((p) => p - 1)}
                      className="rounded bg-gray-200 p-1 disabled:opacity-50"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-gray-600">
                      {productsPage}/{productsMeta.totalPages}
                    </span>
                    <button
                      disabled={productsPage === productsMeta.totalPages}
                      onClick={() => setProductsPage((p) => p + 1)}
                      className="rounded bg-gray-200 p-1 disabled:opacity-50"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function ListStoreTable({ onEdit }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
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
                <React.Fragment key={store.id}>
                  <tr
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => toggleExpand(store.id)}
                  >
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      <div className="flex gap-3">
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
                        <div className="mt-2">{store.name || "___"}</div>
                      </div>
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {store.members[0]?.user?.name || "_"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {STORE_TYPE_LABEL[store.type] || "___"}
                    </td>
                  </tr>
                  {expandedId === store.id && (
                    <StoreDetailRow storeId={store.id} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
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
