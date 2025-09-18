'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StrengthReportData {
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
}

interface Occupation {
  imageUrl: string;
  occupationName: string;
  description: string;
  strength: string;
  score: string;
  memberOccupationId?: number;
  isBookmark?: boolean;
}

interface JobRecommendations {
  first: Occupation;
  second: Occupation;
  third: Occupation;
}

interface LoadingData {
  loadingType: 'strengthReport' | 'jobRecommendation';
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'component';
  content: string;
  timestamp: number;
  questionId?: number;
  selectedOptions?: string[];
  isComplete?: boolean;
  componentType?:
    | 'strengthReport'
    | 'jobCards'
    | 'loading'
    | 'strengthReportGroup';
  componentData?:
    | StrengthReportData
    | JobRecommendations
    | StrengthReportData[]
    | LoadingData
    | null;
}

export interface ChatHistoryContextType {
  messages: ChatMessage[];
  currentStep: number;
  isCompleted: boolean;
  showStrengthReport: boolean;
  addBotMessage: (content: string, questionId?: number) => void;
  addUserMessage: (
    content: string,
    questionId?: number,
    selectedOptions?: string[]
  ) => void;
  addComponentMessage: (
    componentType:
      | 'strengthReport'
      | 'jobCards'
      | 'loading'
      | 'strengthReportGroup',
    componentData?:
      | StrengthReportData
      | JobRecommendations
      | StrengthReportData[]
      | LoadingData
      | null
  ) => void;
  removeMessagesByType: (componentType: string) => void;
  nextStep: () => void;
  completeChat: () => void;
  showStrengthReportStep: () => void;
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
  const [showStrengthReport, setShowStrengthReport] = useState(false);

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

  const addComponentMessage = (
    componentType:
      | 'strengthReport'
      | 'jobCards'
      | 'loading'
      | 'strengthReportGroup',
    componentData?:
      | StrengthReportData
      | JobRecommendations
      | StrengthReportData[]
      | LoadingData
      | null
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'component',
      content: '',
      timestamp: Date.now(),
      componentType,
      componentData,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const removeMessagesByType = (componentType: string) => {
    setMessages((prev) =>
      prev.filter((msg) => msg.componentType !== componentType)
    );
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const completeChat = () => {
    setIsCompleted(true);
    setCurrentStep(11);
  };

  const showStrengthReportStep = () => {
    setShowStrengthReport(true);
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setIsCompleted(false);
    setShowStrengthReport(false);
  };

  return (
    <ChatHistoryContext.Provider
      value={{
        messages,
        currentStep,
        isCompleted,
        showStrengthReport,
        addBotMessage,
        addUserMessage,
        addComponentMessage,
        removeMessagesByType,
        nextStep,
        completeChat,
        showStrengthReportStep,
        resetChat,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};
