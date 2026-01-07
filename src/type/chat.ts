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
    role: "ADMIN" | "STOREOWNER";
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