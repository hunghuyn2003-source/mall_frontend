"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { Socket } from "socket.io-client";
import type { Message, Conversation } from "@/api/chat";

interface UseChatSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  sendMessage: (conversationId: number, content: string) => void;
  joinConversation: (conversationId: number) => void;
  leaveConversation: (conversationId: number) => void;
  startTyping: (conversationId: number) => void;
  stopTyping: (conversationId: number) => void;
}

interface SocketMessageData {
  message?: Message;
  success?: boolean;
}

export const useChatSocket = (
  onNewMessage?: (message: Message) => void,
  onMessageSent?: (message: Message) => void,
  onMessageDeleted?: (data: {
    conversationId: number;
    messageId: number;
  }) => void,
  onConversationUpdated?: (conversation: Conversation) => void,
  onUserTyping?: (data: {
    userId: number;
    conversationId: number;
    isTyping: boolean;
  }) => void,
): UseChatSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // Store callbacks in refs to avoid recreating socket on every render
  const callbacksRef = useRef({
    onNewMessage,
    onMessageSent,
    onMessageDeleted,
    onConversationUpdated,
    onUserTyping,
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onNewMessage,
      onMessageSent,
      onMessageDeleted,
      onConversationUpdated,
      onUserTyping,
    };
  }, [
    onNewMessage,
    onMessageSent,
    onMessageDeleted,
    onConversationUpdated,
    onUserTyping,
  ]);

  useEffect(() => {
    if (!user) return;

    // Prevent multiple connections
    if (socketRef.current?.connected) {
      return;
    }

    // Dynamic import socket.io-client
    import("socket.io-client").then(({ io }) => {
      // Backend WebSocket server URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      let socketUrl = apiUrl.replace(/\/api\/v1$/, "").replace(/\/$/, "");

      // Replace port with 8000 (WebSocket port)
      if (socketUrl.includes(":")) {
        socketUrl = socketUrl.replace(/:\d+/, ":8000");
      } else {
        socketUrl = socketUrl + ":8000";
      }

      console.log("🔌 Connecting to WebSocket:", `${socketUrl}/chat`);

      const newSocket = io(`${socketUrl}/chat`, {
        withCredentials: true,
        transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Connection events
      newSocket.on("connect", () => {
        console.log("✅ WebSocket connected:", newSocket.id);
        setIsConnected(true);
        setError(null);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason);
        setIsConnected(false);
      });

      newSocket.on("connect_error", (err) => {
        console.error("🔴 WebSocket connection error:", err.message);
        setIsConnected(false);
        setError("Không thể kết nối đến server");
      });

      newSocket.on("error", (err: any) => {
        console.error("🔴 WebSocket error:", err);
        setError(
          typeof err === "string" ? err : err?.message || "Có lỗi xảy ra",
        );
      });

      // Chat events
      newSocket.on("connected", (data) => {
        console.log("✅ Connected to chat server:", data);
        setIsConnected(true);
      });

      newSocket.on("new_message", (data: Message | SocketMessageData) => {
        console.log("📨 Received new_message:", data);
        const message =
          (data as SocketMessageData)?.message || (data as Message);
        if (message) {
          callbacksRef.current.onNewMessage?.(message);
        }
      });

      newSocket.on("message_sent", (data: Message | SocketMessageData) => {
        console.log("✅ Received message_sent:", data);
        const message =
          (data as SocketMessageData)?.message || (data as Message);
        if (message) {
          callbacksRef.current.onMessageSent?.(message);
        }
      });

      newSocket.on(
        "message_deleted",
        (data: { conversationId: number; messageId: number }) => {
          console.log("🗑️ Message deleted:", data);
          callbacksRef.current.onMessageDeleted?.(data);
        },
      );

      newSocket.on("conversation_updated", (conversation: Conversation) => {
        console.log("🔄 Conversation updated:", conversation);
        callbacksRef.current.onConversationUpdated?.(conversation);
      });

      newSocket.on(
        "user_typing",
        (data: { userId: number; conversationId: number; typing: boolean }) => {
          console.log("⌨️ User typing:", data);
          callbacksRef.current.onUserTyping?.({
            userId: data.userId,
            conversationId: data.conversationId,
            isTyping: data.typing,
          });
        },
      );
    });

    return () => {
      if (socketRef.current) {
        console.log("🔌 Disconnecting WebSocket...");
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user]);

  const sendMessage = useCallback(
    (conversationId: number, content: string) => {
      if (socketRef.current && isConnected) {
        console.log("📤 Sending message:", { conversationId, content });
        socketRef.current.emit("send_message", { conversationId, content });
      } else {
        console.error("❌ Cannot send message: Socket not connected");
        setError("Chưa kết nối đến server");
      }
    },
    [isConnected],
  );

  const joinConversation = useCallback(
    (conversationId: number) => {
      if (socketRef.current && isConnected) {
        console.log("👋 Joining conversation:", conversationId);
        socketRef.current.emit("join_conversation", { conversationId });
      }
    },
    [isConnected],
  );

  const leaveConversation = useCallback(
    (conversationId: number) => {
      if (socketRef.current && isConnected) {
        console.log("👋 Leaving conversation:", conversationId);
        socketRef.current.emit("leave_conversation", { conversationId });
      }
    },
    [isConnected],
  );

  const startTyping = useCallback(
    (conversationId: number) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("typing_start", { conversationId });
      }
    },
    [isConnected],
  );

  const stopTyping = useCallback(
    (conversationId: number) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("typing_stop", { conversationId });
      }
    },
    [isConnected],
  );

  return {
    socket,
    isConnected,
    error,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
  };
};
