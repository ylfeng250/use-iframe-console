import { useEffect, useState, RefObject } from 'react';

// 定义 ConsoleType 类型
export type ConsoleType =
  | 'iframe-log'
  | 'iframe-info'
  | 'iframe-warn'
  | 'iframe-error';

// 定义消息类型
export interface ConsoleMessage {
  type: ConsoleType;
  message: string;
  timestamp: number;
}

export interface IframeError {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error | null;
  timestamp?: number;
}

const useIframeConsole = (iframeRef: RefObject<HTMLIFrameElement>) => {
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [errors, setErrors] = useState<IframeError[]>([]);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframeWindow = iframeRef.current.contentWindow;

    if (!iframeWindow || !iframeWindow.console) return;

    // 捕获 iframe 中的控制台信息
    const sendConsoleMessage = (type: ConsoleType, args: any[]) => {
      setConsoleMessages((prevMessages) => [
        ...prevMessages,
        {
          type,
          message: args.slice(0).join(' '),
          timestamp: new Date().getTime(),
        },
      ]);
    };

    // 重写 iframe 中的 console 方法
    const originalConsole = { ...iframeWindow.console };
    const validMethods = ['log', 'info', 'warn', 'error'] as const;
    validMethods.forEach((method) => {
      iframeWindow.console[method] = (...args: any[]) => {
        sendConsoleMessage(`iframe-${method}` as ConsoleType, args); // 直接记录控制台信息
        originalConsole[method](...args); // 保留原始行为
      };
    });

    // 捕获 iframe 中的同步错误
    iframeWindow.onerror = (
      event: Event | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      const errorDetails: IframeError = {
        message: event as string,
        source,
        lineno,
        colno,
        error,
        timestamp: new Date().getTime(),
      };
      sendConsoleMessage('iframe-error', [errorDetails]);
      setErrors((prevErrors) => [...prevErrors, errorDetails]);
      return true; // 阻止浏览器的默认错误处理
    };

    // 捕获 iframe 中的未处理 Promise 拒绝
    iframeWindow.addEventListener(
      'unhandledrejection',
      (event: PromiseRejectionEvent) => {
        const errorMessage = `Unhandled promise rejection: ${event.reason}`;
        const errorDetails: IframeError = {
          message: errorMessage,
          timestamp: new Date().getTime(),
          error: event.reason,
          ...event,
        };
        setErrors((prevErrors) => [...prevErrors, errorDetails]);
      }
    );

    // 清理事件监听
    return () => {
      iframeWindow.removeEventListener(
        'unhandledrejection',
        (event: PromiseRejectionEvent) => {}
      );
    };
  }, [iframeRef]);

  return { consoleMessages, errors };
};

export default useIframeConsole;
