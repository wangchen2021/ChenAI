import { useCallback, useRef, useState } from "react";
import { baseURL } from "../api/request";

// 修正类型定义（使用 TypeScript 严格类型）
export interface UseSSEOptions {
  onComplete?: () => void;
  headers?: Record<string, string>;
  onChunk: (res: string) => void;
  onError?: (error: Error) => void;
}

/**
 * 正确的 React Hook 实现 SSE 流式请求
 * 注意：Hook 必须是同步函数，不能加 async
 */
export function useSSE() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // 解析 SSE 数据的核心函数
  const parseSSE = useCallback(
    (data: string, onChunk: (chunk: string) => void): boolean => {
      const lines = data.split("\n");
      let isDone = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;

        const jsonStr = trimmed.slice(6);
        if (jsonStr === "[DONE]") {
          isDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.content || "";
          content.length > 0 && onChunk(content);
        } catch (e) {
          console.error("解析 SSE 数据失败:", e);
        }
      }
      return isDone;
    },
    [],
  );

  // 发送请求的核心方法（返回 Promise）
  const sendRequest = useCallback(
    async (url: string, body: Record<string, any>, options: UseSSEOptions) => {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);

      // 缓冲区定义在循环外部（关键修复）
      let buffer = "";
      const decoder = new TextDecoder();

      try {
        const response = await fetch(baseURL + url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            ...options.headers,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status} ${response.statusText}`,
          );
        }
        if (!response.body) {
          throw new Error("响应体为空，无法读取流式数据");
        }

        const reader = response.body.getReader();

        while (true) {
          const { done, value } = await reader.read();

          // 流结束
          if (done) {
            // 处理最后剩余的缓冲区数据
            if (buffer) {
              parseSSE(buffer, options.onChunk);
            }
            break;
          }

          // 解码并拼接到缓冲区（关键修复：buffer 不在循环内重置）
          buffer += decoder.decode(value, { stream: true });

          // 按换行分割处理
          const boundaryIndex = buffer.lastIndexOf("\n");
          if (boundaryIndex !== -1) {
            const processData = buffer.substring(0, boundaryIndex);
            buffer = buffer.substring(boundaryIndex); // 保留未处理的部分

            const isDone = parseSSE(processData, options.onChunk);
            if (isDone) {
              reader.cancel(); // 主动取消读取
              break;
            }
          }
        }

        // 触发完成回调
        options.onComplete?.();
      } catch (err) {
        const error = err as Error;
        // 忽略主动取消的错误
        if (error.name !== "AbortError") {
          console.error(`SSE 请求失败: ${error.message}`);
          options.onError?.(error);
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [parseSSE],
  );

  // 手动停止请求的方法
  const stopRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  // 返回可访问的属性和方法
  return {
    sendRequest, // 发送请求的方法（需手动调用）
    stopRequest, // 停止请求的方法
    isStreaming, // 是否正在流式传输（状态）
    parseSSE, // 解析方法（可选暴露）
  };
}
