import instance from "@/utils/axios";
import { ChatUser, Conversation, PaginatedResponse, Message } from "@/type/chat";


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


