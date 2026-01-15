"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, } from "@/api/chat";
import { Message, Conversation } from "@/type/chat";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AvatarText from "@/components/ui/avatar/AvatarText";
import { Send, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ChatWindowProps {
  conversation: Conversation | null;
}


interface TempMessage extends Omit<Message, "id"> {
  id: string | number;
}

interface SocketMessageData {
  message?: Message;
  success?: boolean;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messageContent, setMessageContent] = useState("");
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();

  const scrollToBottom = (force = false) => {
    requestAnimationFrame(() => {
      const container = document.getElementById("messages-container");
      if (container) {
        if (force) {
          container.scrollTop = container.scrollHeight;
        } else {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          container.scrollTop = container.scrollHeight;
        }
      } else {
        messagesEndRef.current?.scrollIntoView({
          behavior: force ? "auto" : "smooth",
        });
      }
    });
  };

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["chat-messages", conversation?.id],
    queryFn: () => getMessages(conversation!.id, { page: 1, limit: 50 }),
    enabled: !!conversation,
    staleTime: 10 * 1000,
  });

  const messages = messagesData?.data
    ? [...messagesData.data]
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .reverse()
    : [];

  const {
    isConnected,
    sendMessage: sendMessageSocket,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    error: socketError,
  } = useChatSocket(
    (data: Message | SocketMessageData) => {
 
      const newMessage =
        (data as SocketMessageData)?.message || (data as Message);
      if (
        !newMessage?.conversationId ||
        newMessage.conversationId !== conversation?.id
      ) {
        return;
      }

      queryClient.setQueryData(
        ["chat-messages", conversation.id],
        (old: any) => {
          if (!old) {
            return {
              data: [newMessage],
              meta: { page: 1, limit: 50, total: 1, totalPages: 1 },
            };
          }
          const exists = old.data.some((m: Message) => m.id === newMessage.id);
          if (exists) return old;

          const newData = [newMessage, ...old.data].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          return {
            ...old,
            data: newData,
            meta: { ...old.meta, total: old.meta.total + 1 },
          };
        },
      );
      setTimeout(() => scrollToBottom(true), 50);
    },
    (data: Message | SocketMessageData) => {
      const sentMessage =
        (data as SocketMessageData)?.message || (data as Message);
      if (
        !sentMessage?.conversationId ||
        sentMessage.conversationId !== conversation?.id
      ) {
        return;
      }

      if ((window as any).__messageSendTimeout) {
        clearTimeout((window as any).__messageSendTimeout);
        (window as any).__messageSendTimeout = null;
      }

      setIsSending(false);

      queryClient.setQueryData(
        ["chat-messages", conversation.id],
        (old: any) => {
          if (!old) {
            return {
              data: [sentMessage],
              meta: { page: 1, limit: 50, total: 1, totalPages: 1 },
            };
          }


          const filteredData = old.data.filter((m: TempMessage) => {
            if (
              typeof m.id === "string" &&
              (m.id as string).startsWith("temp-")
            ) {
              return m.content !== sentMessage.content;
            }
            return true;
          });

          const exists = filteredData.some(
            (m: Message) => m.id === sentMessage.id,
          );

          if (exists) {
            return { ...old, data: filteredData };
          }

          const newData = [sentMessage, ...filteredData].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          return {
            ...old,
            data: newData,
            meta: { ...old.meta, total: old.meta.total + 1 },
          };
        },
      );
      setTimeout(() => scrollToBottom(true), 50);
    },
    undefined,
    undefined,
    (data) => {

      if (
        data.conversationId === conversation?.id &&
        data.userId !== currentUser?.id
      ) {
        if (data.isTyping) {
          setTypingUsers((prev) => new Set(prev).add(data.userId));
        } else {
          setTypingUsers((prev) => {
            const next = new Set(prev);
            next.delete(data.userId);
            return next;
          });
        }
      }
    },
  );


  useEffect(() => {
    if (conversation && isConnected) {
      joinConversation(conversation.id);
      return () => {
        leaveConversation(conversation.id);
      };
    }
  }, [conversation?.id, isConnected, joinConversation, leaveConversation]);


  useLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(false);
    }
  }, [messages.length, conversation?.id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!messageContent.trim() || !conversation || !isConnected || isSending) {
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const trimmedContent = messageContent.trim();

    // Optimistic update
    const tempMessage: TempMessage = {
      id: tempId,
      conversationId: conversation.id,
      senderId: currentUser!.id,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser!.id,
        name: currentUser!.name,
        avatar: currentUser!.avatar,
      },
      readBy: [],
    };

    queryClient.setQueryData(["chat-messages", conversation.id], (old: any) => {
      if (!old) {
        return {
          data: [tempMessage],
          meta: { page: 1, limit: 50, total: 1, totalPages: 1 },
        };
      }

      const newData = [tempMessage, ...old.data].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      return {
        ...old,
        data: newData,
      };
    });

    setTimeout(() => scrollToBottom(true), 10);

    setIsSending(true);


    sendMessageSocket(conversation.id, trimmedContent);

    setMessageContent("");

    stopTyping(conversation.id);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    const timeoutId = setTimeout(() => {
      setIsSending(false);
      console.warn("Message send timeout - no response from server");
    }, 10000);


    (window as any).__messageSendTimeout = timeoutId;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(e.target.value);

    if (conversation && isConnected) {
      startTyping(conversation.id);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(conversation.id);
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherUser = () => {
    return conversation?.members.find((m) => m.user.id !== currentUser?.id)
      ?.user;
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Chọn một cuộc trò chuyện để bắt đầu
          </p>
        </div>
      </div>
    );
  }

  const otherUser = getOtherUser();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <AvatarText name={otherUser?.name || ""} className="h-10 w-10" />
          )}
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {otherUser?.name || "Unknown"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div id="messages-container" className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có tin nhắn nào
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: TempMessage) => {
              const isOwn = message.senderId === currentUser?.id;
              const isTempMessage =
                typeof message.id === "string" &&
                (message.id as string).startsWith("temp-");

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[70%] gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {!isOwn && (
                      <div className="shrink-0">
                        {message.sender.avatar ? (
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <AvatarText
                            name={message.sender.name}
                            className="h-8 w-8"
                          />
                        )}
                      </div>
                    )}
                    <div
                      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                    >
                      {!isOwn && (
                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                          {message.sender.name}
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                        } ${isTempMessage ? "opacity-60" : ""}`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        {dayjs(message.createdAt).format("HH:mm")}
                        {isTempMessage && (
                          <span className="text-xs">• Đang gửi...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {typingUsers.size > 0 && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        {socketError && (
          <div className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {socketError}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={messageContent}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            disabled={!isConnected || isSending}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!messageContent.trim() || !isConnected || isSending}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
