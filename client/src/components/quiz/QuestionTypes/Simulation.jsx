import React from 'react';
import { FiMonitor, FiCheckSquare } from 'react-icons/fi';

const Simulation = ({ question, selectedAnswer, onAnswer }) => {
  const options = question?.options || [];

  return (
    <div
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Simulated Application Window Titlebar */}
      <div
        style={{
          background: 'var(--bg-card-alt)',
          borderBottom: '1px solid var(--border-color)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
          <FiMonitor /> MÔI TRƯỜNG MÔ PHỎNG THỰC HÀNH IC3 (VIRTUAL LAB)
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
        </div>
      </div>

      <div style={{ padding: '18px' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Hãy chọn trình tự thao tác chuẩn xác nhất trên giao diện phần mềm để hoàn thành yêu cầu trên:
        </p>

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
                  padding: '14px 16px',
                  background: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                  border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '0.94rem',
                  fontWeight: isSelected ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                <FiCheckSquare
                  style={{
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontSize: '1.15rem',
                    flexShrink: 0,
                  }}
                />
                <span>{opt.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
