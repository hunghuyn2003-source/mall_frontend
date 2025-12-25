"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { Socket } from "socket.io-client";

interface PaymentNotification {
  title: string;
  message: string;
  paymentMonth: number;
  paymentYear: number;
  notificationId?: number;
  createdAt: string;
}

interface UseFinanceSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

export const useFinanceSocket = (
  onPaymentNotification?: (notification: PaymentNotification) => void,
): UseFinanceSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // Store callback in ref to avoid recreating socket on every render
  const callbackRef = useRef(onPaymentNotification);

  useEffect(() => {
    callbackRef.current = onPaymentNotification;
  }, [onPaymentNotification]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    // Prevent multiple connections - nếu đã connected thì chỉ update listener
    if (socketRef.current?.connected) {
      // Socket đã tồn tại, chỉ cần update listener
      socketRef.current.off("payment_notification");
      socketRef.current.on(
        "payment_notification",
        (notification: PaymentNotification) => {
          if (mounted) {
            callbackRef.current?.(notification);
          }
        },
      );
      return () => {
        mounted = false;
        if (socketRef.current) {
          socketRef.current.off("payment_notification");
        }
      };
    }

    // Dynamic import socket.io-client
    import("socket.io-client").then(({ io }) => {
      if (!mounted) return;

      // Backend WebSocket server URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      let socketUrl = apiUrl.replace(/\/api\/v1$/, "").replace(/\/$/, "");

      // Replace port with 8000 (WebSocket port)
      if (socketUrl.includes(":")) {
        socketUrl = socketUrl.replace(/:\d+/, ":8000");
      } else {
        socketUrl = socketUrl + ":8000";
      }

      console.log(
        "🔌 Connecting to Finance WebSocket:",
        `${socketUrl}/finance`,
      );

      const newSocket = io(`${socketUrl}/finance`, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Connection events
      newSocket.on("connect", () => {
        if (mounted) {
          console.log("✅ Finance WebSocket connected:", newSocket.id);
          setIsConnected(true);
          setError(null);
        }
      });

      newSocket.on("disconnect", (reason) => {
        if (mounted) {
          console.log("❌ Finance WebSocket disconnected:", reason);
          setIsConnected(false);
        }
      });

      newSocket.on("connect_error", (err) => {
        if (mounted) {
          console.error("🔴 Finance WebSocket connection error:", err.message);
          setIsConnected(false);
          setError("Không thể kết nối đến server");
        }
      });

      newSocket.on("error", (err: any) => {
        if (mounted) {
          console.error("🔴 Finance WebSocket error:", err);
          setError(
            typeof err === "string" ? err : err?.message || "Có lỗi xảy ra",
          );
        }
      });

      // Finance events
      newSocket.on("connected", (data) => {
        if (mounted) {
          console.log("✅ Connected to finance server:", data);
          setIsConnected(true);
        }
      });

      newSocket.on(
        "payment_notification",
        (notification: PaymentNotification) => {
          if (mounted) {
            console.log("💰 Payment notification received:", notification);
            callbackRef.current?.(notification);
          }
        },
      );
    });

    return () => {
      if (socketRef.current) {
        console.log("🔌 Disconnecting Finance WebSocket...");
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user]);

  return {
    socket,
    isConnected,
    error,
  };
};
