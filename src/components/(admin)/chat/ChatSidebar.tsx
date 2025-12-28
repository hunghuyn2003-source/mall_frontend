"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChatUsers, type ChatUser, type Conversation } from "@/api/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AvatarText from "@/components/ui/avatar/AvatarText";
import { Search } from "lucide-react";

interface ChatSidebarProps {
  onSelectUser: (user: ChatUser) => void;
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId: number | null;
}

export default function ChatSidebar({
  onSelectUser,
  onSelectConversation,
  selectedConversationId,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isStoreOwner = currentUser?.role === "STOREOWNER";
  const [activeTab, setActiveTab] = useState<"users" | "conversations">(
    isStoreOwner ? "conversations" : "conversations",
  );

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["chat-users"],
    queryFn: getChatUsers,
    staleTime: 30 * 1000,
  });

  const storeOwnerUsers = users.filter((user) => user.role === "STOREOWNER");
  const adminUsers = users.filter((user) => user.role === "ADMIN");

  const filteredUsers = storeOwnerUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredAdminUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {!isStoreOwner && (
        <div className="mt-2 flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("conversations")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "conversations"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Nội bộ
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Chủ cửa hàng
          </button>
        </div>
      )}

      {/* Search */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "users" ? (
          <div>
            {usersLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Đang tải...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchQuery
                  ? "Không tìm thấy người dùng"
                  : "Không có người dùng nào"}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <AvatarText name={user.name} className="h-12 w-12" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div>
            {usersLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Đang tải...
              </div>
            ) : filteredAdminUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchQuery
                  ? "Không tìm thấy người dùng"
                  : "Không có người dùng nào"}
              </div>
            ) : (
              filteredAdminUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <AvatarText name={user.name} className="h-12 w-12" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
