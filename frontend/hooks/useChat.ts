import { useState } from 'react';
import { chatService } from '@/lib/services/chatService';
import { conversationService } from '@/lib/services/conversations';
import { ChatRequest, Conversation } from '@/types';

export const useChat = () => {
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async (chatSessionId: string) => {
    try {
      const history = await conversationService.getByChatSession(chatSessionId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async (chatRequest: ChatRequest) => {
    setIsLoading(true);
    try {
      const response = await chatService.sendMessage(chatRequest);
      
      // Reload history to get updated conversations
      await loadHistory(chatRequest.chat_session_id);
      
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    loadHistory,
  };
};