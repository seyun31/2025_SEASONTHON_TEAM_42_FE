'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: number;
  questionId?: number;
  selectedOptions?: string[];
  isComplete?: boolean;
}

export interface ChatHistoryContextType {
  messages: ChatMessage[];
  currentStep: number;
  isCompleted: boolean;
  addBotMessage: (content: string, questionId?: number) => void;
  addUserMessage: (
    content: string,
    questionId?: number,
    selectedOptions?: string[]
  ) => void;
  nextStep: () => void;
  completeChat: () => void;
  resetChat: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(
  undefined
);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};

interface ChatHistoryProviderProps {
  children: ReactNode;
}

export const ChatHistoryProvider: React.FC<ChatHistoryProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const addBotMessage = (content: string, questionId?: number) => {
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (msg) => msg.content === content && msg.type === 'bot'
      ); // 메시지 중복 방지
      if (isDuplicate) return prev;

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: Date.now(),
        questionId,
      };
      return [...prev, newMessage];
    });
  };

  const addUserMessage = (
    content: string,
    questionId?: number,
    selectedOptions?: string[]
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now(),
      questionId,
      selectedOptions,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const completeChat = () => {
    setIsCompleted(true);
    setCurrentStep(10);
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  return (
    <ChatHistoryContext.Provider
      value={{
        messages,
        currentStep,
        isCompleted,
        addBotMessage,
        addUserMessage,
        nextStep,
        completeChat,
        resetChat,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};
