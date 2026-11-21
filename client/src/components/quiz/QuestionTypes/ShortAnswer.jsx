import React from 'react';

const ShortAnswer = ({ answer, onAnswer }) => {
  return (
    <div>
      <input
        type="text"
        value={answer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Nhập câu trả lời của bạn vào đây..."
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'var(--bg-primary)',
          border: '2px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          outline: 'none',
        }}
      />
    </div>
  );
};

export default ShortAnswer;
