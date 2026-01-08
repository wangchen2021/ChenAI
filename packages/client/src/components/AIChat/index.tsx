import React, { useState, useRef, useEffect } from 'react';
import {
  AIChatGlobalStyle,
  ChatContainer,
  ChatHeader,
  ChatContent,
  MessageBubble,
  ChatInputArea,
} from './styles';
import type { getAIStreamResReqParams } from '@chen/shared';
import { useSSE } from '../../hooks/useSSE';
import MarkdownRenderer from '../Markdown';

// 定义消息类型
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

const AIChat: React.FC = () => {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(0);
  const { sendRequest } = useSSE();
  // 自动滚动到底部
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    // 添加AI加载中消息
    const loadingMessage: Message = {
      id: String(messageId.current++),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // 模拟API请求（实际项目中替换为真实接口）
      const param: getAIStreamResReqParams = {
        text: inputValue,
      };
      sendRequest('/openAI/getTextRes', param, {
        onChunk: (res) => {
          // 替换加载中消息为实际AI回复
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id
                ? {
                    ...msg,
                    content: msg.content + res,
                    isLoading: false,
                  }
                : msg,
            ),
          );
        },
      });
    } catch (error) {
      // 错误处理
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: '抱歉，请求失败，请稍后重试。',
                isLoading: false,
              }
            : msg,
        ),
      );
      console.error('发送消息失败:', error);
    } finally {
      setIsSending(false);
    }
  };

  // 清空输入框
  const handleClearInput = () => {
    setInputValue('');
  };

  // 清空所有消息
  const handleClearAllMessages = () => {
    setMessages([]);
  };

  // 处理回车发送（Shift+回车换行）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AIChatGlobalStyle />
      <ChatContainer className="ai-chat-container">
        {/* 头部 */}
        <ChatHeader>
          <h1>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Chen AI
          </h1>
          <button className="settings-btn" onClick={handleClearAllMessages}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 12H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 17H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </ChatHeader>

        {/* 对话内容 */}
        <ChatContent ref={contentRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM14 9H9V15H14V9Z"
                  fill="currentColor"
                />
              </svg>
              <h3>开始你的智能对话</h3>
              <p>输入问题，chen 会为你提供专业、准确的回答</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} $isUser={message.isUser}>
                {message.isLoading ? (
                  <div className="message-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <>
                    {message.isUser ? (
                      <div>{message.content}</div>
                    ) : (
                      <MarkdownRenderer content={message.content}></MarkdownRenderer>
                    )}
                    <div className="message-time">{message.timestamp.toLocaleTimeString()}</div>
                  </>
                )}
              </MessageBubble>
            ))
          )}
        </ChatContent>

        {/* 输入区域 */}
        <ChatInputArea>
          <div className="input-container">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题，按回车发送，Shift+回车换行..."
              disabled={isSending}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
            >
              {isSending ? '发送中...' : '发送'}
            </button>
          </div>
          <div className="input-actions">
            <span>支持多行文本输入</span>
            <button
              className="clear-btn"
              onClick={handleClearInput}
              disabled={!inputValue.trim() || isSending}
            >
              清空
            </button>
          </div>
        </ChatInputArea>
      </ChatContainer>
    </>
  );
};

export default AIChat;
