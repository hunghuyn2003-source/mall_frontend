"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/api/products";
import { ChevronLeft, ChevronRight, Package, Search } from "lucide-react";

interface Props {
  storeId: number;
  onAddToCart: (product: any) => void;
}

export default function ListProduct({ storeId, onAddToCart }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: productData } = useQuery({
    queryKey: ["products", storeId, page, debouncedSearch],
    queryFn: () =>
      listProducts({ page, limit, search: debouncedSearch, storeId }),
    placeholderData: (prev) => prev,
    enabled: !!storeId,
  });

  const products = productData?.data || [];
  const meta = productData?.meta;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-3">
          {products.map((product: any) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition hover:border-blue-400 hover:shadow-md"
            >
              <div className="mb-2 flex h-40 w-full items-center justify-center rounded-lg bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="mb-1 truncate text-sm font-medium text-gray-800">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {product.price?.toLocaleString("vi-VN")} đ
                </p>
              </div>

              <p className="text-xs text-gray-400">
                Tồn kho: {product.stock ?? 0}
              </p>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex h-32 items-center justify-center text-gray-500">
            Không có sản phẩm
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gray-600">
          {meta?.page || 1} / {meta?.totalPages || 1}
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
