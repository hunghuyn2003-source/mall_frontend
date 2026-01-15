"use client";

import { useEffect, useRef, useState } from "react";
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
  isConnected: boolean;
  error: string | null;
}

export const useFinanceSocket = (
  onPaymentNotification?: (notification: PaymentNotification) => void,
): UseFinanceSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const callbackRef = useRef(onPaymentNotification);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    callbackRef.current = onPaymentNotification;
  }, [onPaymentNotification]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      const { io } = await import("socket.io-client");
      if (cancelled) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const socketUrl = apiUrl.replace(/\/api\/v1$/, "").replace(/\/$/, "");

      const socket = io(`${socketUrl}/finance`, {
        withCredentials: true,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        setError(null);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("connect_error", () => {
        setIsConnected(false);
        setError("Không thể kết nối đến server");
      });

      socket.on("payment_notification", (notification: PaymentNotification) => {
        callbackRef.current?.(notification);
      });
    })();

    return () => {
      cancelled = true;

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setIsConnected(false);
    };
  }, [user]);

  return {
    isConnected,
    error,
  };
};
