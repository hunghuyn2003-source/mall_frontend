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

export const getChatUsers = async (): Promise<ChatUser[]> => {
  const res = await instance.get("/api/v1/chat/users");
  return res.data;
};

export const getConversationWithUser = async (
  userId: number,
): Promise<Conversation> => {
  const res = await instance.get(`/api/v1/chat/conversations/with/${userId}`);
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


