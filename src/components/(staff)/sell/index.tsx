"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellPos } from "@/api/products";
import { toast } from "react-toastify";
import ListProduct from "./ListProduct";
import Cart, { CartItem } from "./Cart";

export default function Sell({ storeId }: { storeId: number }) {
  const queryClient = useQueryClient();
  const store = useSelector((state: RootState) => state.store.activeStore);
  const user = useSelector((state: RootState) => state.auth.user);
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Hàm in hóa đơn trực tiếp qua iframe ẩn
  const printInvoice = (items: CartItem[], invoiceId?: number) => {
    const iframe = printFrameRef.current;
    if (!iframe) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("vi-VN");
    const timeStr = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hóa đơn</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 0;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              width: 58mm; 
              margin: 0 auto;
            }
            body { 
              font-family: 'Courier New', monospace; 
              padding: 3mm; 
              font-size: 11px; 
            }
            .receipt {
              width: 100%;
            }
            .header { text-align: center; margin-bottom: 6px; border-bottom: 1px dashed #000; padding-bottom: 6px; }
            .store-name { font-size: 13px; font-weight: bold; }
            .info { margin-bottom: 6px; font-size: 10px; }
            .info div { margin: 1px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th { border-bottom: 1px solid #000; text-align: left; padding: 1px 0; }
            td { padding: 1px 0; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .total { border-top: 1px dashed #000; padding-top: 6px; margin-top: 6px; font-weight: bold; display: flex; justify-content: space-between; font-size: 12px; }
            .footer { text-align: center; margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; font-size: 9px; }
          </style>
        </head>
        <body>
          <div class="receipt">
          <div class="header">
            <div class="store-name">${store?.name || "Cửa hàng"}</div>
            <div>HÓA ĐƠN BÁN HÀNG</div>
          </div>
          <div class="info">
            <div>Mã HĐ: #${invoiceId || "---"}</div>
            <div>Ngày: ${dateStr} - ${timeStr}</div>
            <div>Thu ngân: ${user?.name || "---"}</div>
          </div>
          <table>
            <thead><tr><th>Sản phẩm</th><th class="text-center">SL</th><th class="text-right">Giá</th><th class="text-right">TT</th></tr></thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">${item.price.toLocaleString("vi-VN")}</td>
                  <td class="text-right">${(item.price * item.quantity).toLocaleString("vi-VN")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="total"><span>TỔNG:</span><span>${total.toLocaleString("vi-VN")} đ</span></div>
          <div class="footer"><div>Cảm ơn quý khách!</div></div>
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(invoiceHTML);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 100);
    }
  };

  const sellMutation = useMutation({
    mutationFn: () =>
      sellPos({
        storeId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    onSuccess: (data) => {
      toast.success("Xuất hóa đơn thành công!");
      // In hóa đơn trực tiếp
      printInvoice([...cartItems], data?.id || data?.invoiceId);
      setCartItems([]);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi xuất hóa đơn",
      );
    },
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    sellMutation.mutate();
  };

  return (
    <>
      <div className="flex h-[calc(100vh-140px)] gap-4">
        <div className="w-2/3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <ListProduct storeId={storeId} onAddToCart={handleAddToCart} />
        </div>

        <div className="w-1/3 rounded-xl border border-gray-200 bg-white p-4">
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            isLoading={sellMutation.isPending}
          />
        </div>
      </div>

      {/* Iframe ẩn để in hóa đơn */}
      <iframe
        ref={printFrameRef}
        style={{ display: "none" }}
        title="print-invoice"
      />
    </>
  );
}
