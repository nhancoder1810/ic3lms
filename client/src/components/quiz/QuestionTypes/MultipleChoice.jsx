import React from 'react';

const MultipleChoice = ({ question, selectedAnswer, onAnswer }) => {
  const options = question?.options || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map((opt, idx) => {
        const isSelected = selectedAnswer === idx;
        return (
          <div
            key={idx}
            onClick={() => onAnswer(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-primary)',
              border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isSelected && (
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                  }}
                />
              )}
            </div>
            <span>{opt.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MultipleChoice;
