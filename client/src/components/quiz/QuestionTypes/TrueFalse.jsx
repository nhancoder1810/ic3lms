import React from 'react';

const TrueFalse = ({ selectedAnswer, onAnswer }) => {
  const getStyle = (value) => {
    const isSelected = selectedAnswer === value;
    const activeColor = value === 'true' ? 'var(--accent-green)' : 'var(--accent-red)';
    return {
      flex: 1,
      padding: '22px 18px',
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${isSelected ? activeColor : 'var(--border-color)'}`,
      background: isSelected ? 'var(--bg-card-alt)' : 'var(--bg-primary)',
      color: isSelected ? activeColor : 'var(--text-primary)',
      fontSize: '1.05rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
    };
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <button type="button" style={getStyle('true')} onClick={() => onAnswer('true')}>
        ✓ ĐÚNG (TRUE)
      </button>
      <button type="button" style={getStyle('false')} onClick={() => onAnswer('false')}>
        ✕ SAI (FALSE)
      </button>
    </div>
  );
};

export default TrueFalse;
