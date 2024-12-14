import React from 'react';
import { ConsoleMessage, IframeError, ConsoleType } from './use-iframe-console'; // 假设这是你定义的类型

// 样式定义
const containerStyle: React.CSSProperties = {
  padding: '20px',
  maxHeight: '400px',
  overflowY: 'auto',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const messageWrapperStyle = (type: ConsoleType): React.CSSProperties => ({
  padding: '10px',
  margin: '5px 0',
  borderRadius: '4px',
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '14px',
  color: '#333',
  backgroundColor:
    type === 'iframe-log'
      ? '#e3f7e6'
      : type === 'iframe-info'
        ? '#d9ecf9'
        : type === 'iframe-warn'
          ? '#fff4e6'
          : '#ffe6e6',
  borderLeft: `5px solid ${
    type === 'iframe-log'
      ? '#38c172'
      : type === 'iframe-info'
        ? '#3498db'
        : type === 'iframe-warn'
          ? '#f39c12'
          : '#e74c3c'
  }`,
});

const timestampStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#777',
  marginLeft: '10px',
};

const errorDetailsStyle: React.CSSProperties = {
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#fdf2f2',
  borderLeft: '5px solid #e74c3c',
  fontSize: '14px',
  color: '#e74c3c',
};

const ConsoleDisplay: React.FC<{
  consoleMessages: ConsoleMessage[];
  errors: IframeError[];
}> = ({ consoleMessages, errors }) => {
  return (
    <div style={containerStyle}>
      <h2>Console Output</h2>
      {/* 控制台信息 */}
      {consoleMessages.length > 0 &&
        consoleMessages.map((msg, index) => (
          <div key={index} style={messageWrapperStyle(msg.type)}>
            {msg.message}
            <span style={timestampStyle}>{msg.timestamp}</span>
          </div>
        ))}

      {/* 错误信息 */}
      {errors.length > 0 &&
        errors.map((error, index) => (
          <div key={index} style={errorDetailsStyle}>
            <div>{error.message}</div>
            {error.source && <div>Source: {error.source}</div>}
            {error.lineno && (
              <div>
                Line: {error.lineno}, Column: {error.colno}
              </div>
            )}
            {error.error && (
              <div>
                Error Details: {error.error.message || 'No details available'}
              </div>
            )}
            <span style={timestampStyle}>{error.timestamp}</span>
          </div>
        ))}
    </div>
  );
};

export default ConsoleDisplay;
