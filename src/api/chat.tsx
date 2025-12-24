import instance from "@/utils/axios";

// Types
export interface ChatUser {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
  role: "ADMIN" | "STOREOWNER";
  conversationId: number | null;
}

export interface ConversationMember {
  user: {
    id: number;
    name: string;
    avatar: string | null;
    email: string;
    role: "ADMIN" | "STOREOWNER" | "STORESTAFF";
  };
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
  sender: {
    id: number;
    name: string;
    avatar: string | null;
  };
  readBy: Array<{ userId: number }>;
  createdAt: string;
}

export interface Conversation {
  id: number;
  type: "DIRECT";
  members: ConversationMember[];
  lastMessage: Message | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Users
export const getChatUsers = async (): Promise<ChatUser[]> => {
  const res = await instance.get("/api/v1/chat/users");
  return res.data;
};

// Conversations
export const getConversationWithUser = async (
  userId: number,
): Promise<Conversation> => {
  const res = await instance.get(`/api/v1/chat/conversations/with/${userId}`);
  return res.data;
};

export const getConversations = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Conversation>> => {
  const res = await instance.get("/api/v1/chat/conversations", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    },
  });
  return res.data;
};

export const getConversation = async (id: number): Promise<Conversation> => {
  const res = await instance.get(`/api/v1/chat/conversations/${id}`);
  return res.data;
};

export const createConversation = async (payload: {
  memberIds: number[];
}): Promise<Conversation> => {
  const res = await instance.post("/api/v1/chat/conversations", payload);
  return res.data;
};

export const leaveConversation = async (
  id: number,
): Promise<{ message: string }> => {
  const res = await instance.post(`/api/v1/chat/conversations/${id}/leave`);
  return res.data;
};

// Messages
export const sendMessage = async (payload: {
  conversationId: number;
  content: string;
}): Promise<Message> => {
  const res = await instance.post("/api/v1/chat/messages", payload);
  return res.data;
};

export const getMessages = async (
  conversationId: number,
  params?: {
    page?: number;
    limit?: number;
  },
): Promise<PaginatedResponse<Message>> => {
  const res = await instance.get(
    `/api/v1/chat/conversations/${conversationId}/messages`,
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
      },
    },
  );
  return res.data;
};

export const deleteMessage = async (
  id: number,
): Promise<{ message: string }> => {
  const res = await instance.delete(`/api/v1/chat/messages/${id}`);
  return res.data;
};

// Push Notifications
export interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  platform: "WEB";
  deviceId?: string;
}

export const subscribePush = async (
  payload: PushSubscription,
): Promise<{
  id: number;
  userId: number;
  endpoint: string;
  platform: string;
  createdAt: string;
}> => {
  const res = await instance.post("/api/v1/chat/push/subscribe", payload);
  return res.data;
};

export const unsubscribePush = async (payload: {
  endpoint: string;
}): Promise<{ message: string }> => {
  const res = await instance.post("/api/v1/chat/push/unsubscribe", payload);
  return res.data;
};
