"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getConversationWithUser,

} from "@/api/chat";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { ChatUser, Conversation } from "@/type/chat";

export default function Chat() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


  const { data: conversationWithUser, isLoading: loadingConversation } =
    useQuery({
      queryKey: ["chat-conversation-with-user", selectedUserId],
      queryFn: () => getConversationWithUser(selectedUserId!),
      enabled: !!selectedUserId,
    });


  React.useEffect(() => {
    if (conversationWithUser) {
      setSelectedConversation(conversationWithUser);
    }
  }, [conversationWithUser]);

  const handleSelectUser = async (user: ChatUser) => {
    setSelectedUserId(user.id);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedUserId(null);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="w-80 flex-shrink-0">
        <ChatSidebar
          onSelectUser={handleSelectUser}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id || null}
        />
      </div>
      <div className="flex-1">
        <ChatWindow conversation={selectedConversation} />
      </div>
    </div>
  );
}
