// src/components/MarkdownRenderer/MarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import "github-markdown-css"; // 引入 GitHub 样式
import rehypeHighlight from 'rehype-highlight'; // 代码高亮（可选）
import 'highlight.js/styles/github.css'; // 代码高亮样式（可选）

interface MarkdownRendererProps {
  content: string; // MD 文本（支持增量更新）
  className?: string;
}

/**
 * 优雅渲染 Markdown 的通用组件
 * 支持流式增量渲染（适配 AI 流式输出）
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`markdown-body ${className}`} style={{
      fontSize: '14px',
      lineHeight: '1.7',
      color: '#24292f',
      padding: '0', // 取消默认 padding，由外层容器控制
    }}>
      <ReactMarkdown
        // 关键配置：支持流式增量渲染（即使内容不完整也能解析）
        skipHtml={false} // 允许 MD 中的 HTML 标签
        rehypePlugins={[rehypeHighlight]} // 代码高亮插件（可选）
        components={{
          // 自定义 MD 元素样式（按需调整）
          h2: ({ children }) => (
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              margin: '16px 0 8px',
              color: '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px',
            }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '12px 0 6px',
              color: '#111827',
            }}>
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul style={{
              margin: '8px 0',
              paddingLeft: '20px',
              listStyle: 'disc',
            }}>
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li style={{
              margin: '4px 0',
            }}>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong style={{
              color: '#111827',
              fontWeight: 600,
            }}>
              {children}
            </strong>
          ),
          p: ({ children }) => (
            <p style={{
              margin: '8px 0',
            }}>
              {children}
            </p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;