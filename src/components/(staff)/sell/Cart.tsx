"use client";

import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isLoading,
}: Props) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Giỏ hàng</h2>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
            {items.length}
          </span>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <ShoppingCart className="mb-2 h-12 w-12" />
            <p>Chưa có sản phẩm</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-sm text-blue-600">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="rounded bg-gray-100 p-1 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.productId, item.quantity + 1)
                    }
                    className="rounded bg-gray-100 p-1 hover:bg-gray-200"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="w-20 text-right text-sm font-semibold text-gray-800">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </div>

                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">Tổng cộng:</span>
          <span className="text-xl font-bold text-blue-600">
            {total.toLocaleString("vi-VN")} đ
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0 || isLoading}
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Xuất hóa đơn"}
        </button>
      </div>
    </div>
  );
}
