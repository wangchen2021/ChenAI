import styled, { createGlobalStyle } from 'styled-components';
import { rgba } from 'polished';

// 全局样式重置（仅作用于当前组件）
export const AIChatGlobalStyle = createGlobalStyle`
  .ai-chat-container * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .ai-chat-container {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: ${rgba('#6366F1', 0.3)};
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-track {
    background-color: ${rgba('#E5E7EB', 0.5)};
  }
`;

// 主容器
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #F9FAFB;
  border-radius: 8px;
  box-shadow: 0 0 20px ${rgba('#000', 0.05)};
  overflow: hidden;
`;

// 头部区域
export const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #6366F1;
  color: white;
  box-shadow: 0 2px 8px ${rgba('#000', 0.1)};
  
  h1 {
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .settings-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: ${rgba('#fff', 0.1)};
    }
  }
`;

// 对话内容区域
export const ChatContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  // 空状态
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #9CA3AF;
    text-align: center;
    
    svg {
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
      color: #D1D5DB;
    }
    
    h3 {
      font-size: 18px;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    p {
      font-size: 14px;
      max-width: 400px;
    }
  }
`;

// 消息气泡通用样式
export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  
  // 用户消息
  ${props => props.$isUser && `
    background-color: #6366F1;
    color: white;
    border-bottom-right-radius: 4px;
  `}
  
  // AI 消息
  ${props => !props.$isUser && `
    background-color: white;
    color: #111827;
    border: 1px solid #E5E7EB;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px ${rgba('#000', 0.05)};
  `}
  
  .message-time {
    font-size: 10px;
    opacity: 0.7;
    margin-top: 4px;
    text-align: right;
  }
  
  .message-loading {
    display: flex;
    gap: 4px;
    padding: 4px 0;
    
    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${props => props.$isUser ? '#fff' : '#6366F1'};
      animation: pulse 1.2s infinite ease-in-out;
      
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
`;

// 输入区域
export const ChatInputArea = styled.div`
  padding: 24px;
  border-top: 1px solid #E5E7EB;
  background-color: white;
  
  .input-container {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    
    textarea {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      resize: none;
      min-height: 60px;
      max-height: 200px;
      font-size: 14px;
      line-height: 1.5;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: #6366F1;
        box-shadow: 0 0 0 2px ${rgba('#6366F1', 0.1)};
      }
      
      &::placeholder {
        color: #9CA3AF;
      }
    }
    
    .send-btn {
      padding: 12px 24px;
      background-color: #6366F1;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
      white-space: nowrap;
      
      &:hover {
        background-color: #4F46E5;
      }
      
      &:disabled {
        background-color: #9CA3AF;
        cursor: not-allowed;
      }
    }
  }
  
  .input-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    color: #9CA3AF;
    
    .clear-btn {
      background: transparent;
      border: none;
      color: #9CA3AF;
      cursor: pointer;
      
      &:hover {
        color: #EF4444;
      }
    }
  }
`;