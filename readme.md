# iframe控制台输出捕获

捕获iframe内的console输出和错误信息，并将其展示在父页面中。

## 主要功能
- [x] 捕获iframe中的console.log、info、warn、error输出。
- [x] 捕获iframe中的 Unhandled promise rejection。
- [x] 提供清晰的错误信息展示
- []给出错误消息、来源、行号和列号等。

## 使用方法

在React组件中引入`useIframeConsole`, 可选择的使用 `ConsoleDisplay`组件进行消息展示

以下是一个简单的示例：

### 1. 安装


```bash
npm install use-iframe-console
```

### 2. 使用

```jsx
import React, { useEffect, useRef } from 'react';
import useIframeDebugger from './index'; // 导入自定义 Hook
import ReactDOM from 'react-dom/client';
import { ConsoleDisplay } from './index';

const App: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { consoleMessages, errors } = useIframeDebugger(iframeRef);
  useEffect(() => {
    setTimeout(() => {
      console.log('发送消息给 iframe');
      console.error('这是一个错误');
      console.warn('这是一个警告');
      console.info('这是一个信息');
      Promise.reject('xxxx');
    }, 100);
  }, []);
  return (
    <div>
      <h2>Debugger</h2>

      <iframe
        ref={iframeRef}
        src="http://localhost:5173/"
        width="600"
        height="400"
      />

      <ConsoleDisplay consoleMessages={consoleMessages} errors={errors} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

```

## 开发


```bash
# 安装依赖
npm install
# 启动服务
npm run dev
```

## 协议
[MIT](https://opensource.org/license/mit)