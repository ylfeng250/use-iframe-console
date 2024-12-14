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
