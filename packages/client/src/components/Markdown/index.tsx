// src/components/MarkdownRenderer/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css"; // 引入 GitHub 样式
import rehypeHighlight from "rehype-highlight"; // 代码高亮（可选）
// 1. 替换为 dark 模式的高亮样式
import "highlight.js/styles/github-dark.css"; // 暗黑模式代码高亮样式

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
  className = "",
}) => {
  return (
    <div
      className={`markdown-body ${className}`}
      style={{
        fontSize: "14px",
        lineHeight: "1.7",
        color: "#24292f",
        padding: "0", // 取消默认 padding，由外层容器控制
        // 可选：如果需要整体暗黑模式，可添加背景色
        // backgroundColor: '#18181b',
        // color: '#e4e4e7',
      }}
    >
      {/* 2. 新增代码块样式：放大字号 + 适配 dark 模式的基础样式 */}
      <style>
        {`
          /* 放大代码块字体大小，默认 14px 调整为 16px（可按需修改） */
          .markdown-body pre code {
            font-size: 13px !important; 
            line-height: 1.6 !important;
          }
          /* 优化代码块容器样式，适配 dark 模式 */
          .markdown-body pre {
            background-color: #161b22 !important; /* GitHub dark 背景色 */
            padding: 16px !important;
            border-radius: 6px !important;
          }
        `}
      </style>
      <ReactMarkdown
        // 关键配置：支持流式增量渲染（即使内容不完整也能解析）
        skipHtml={false} // 允许 MD 中的 HTML 标签
        rehypePlugins={[rehypeHighlight]} // 代码高亮插件（可选）
        components={{
          // 自定义 MD 元素样式（按需调整）
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: "16px 0 8px",
                color: "#111827",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                margin: "12px 0 6px",
                color: "#111827",
              }}
            >
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul
              style={{
                margin: "8px 0",
                paddingLeft: "20px",
                listStyle: "disc",
              }}
            >
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li
              style={{
                margin: "4px 0",
              }}
            >
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong
              style={{
                color: "#111827",
                fontWeight: 600,
              }}
            >
              {children}
            </strong>
          ),
          p: ({ children }) => (
            <p
              style={{
                margin: "8px 0",
              }}
            >
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
