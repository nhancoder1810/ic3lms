import React, { useState } from 'react';

const DragDrop = ({ question, answer, onAnswer }) => {
  const allItems = question?.options?.map((o) => o.text) || [];
  const placed = answer || [];
  const available = allItems.filter((item) => !placed.includes(item));

  const [dragOverActive, setDragOverActive] = useState(false);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverActive(false);
    const item = e.dataTransfer.getData('text/plain');
    if (item && !placed.includes(item)) {
      onAnswer([...placed, item]);
    }
  };

  const handleClickAdd = (item) => {
    if (!placed.includes(item)) {
      onAnswer([...placed, item]);
    }
  };

  const handleRemove = (item) => {
    onAnswer(placed.filter((i) => i !== item));
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '250px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
          Các mục lựa chọn (Kéo hoặc Nhấp để chọn)
        </div>
        {available.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onClick={() => handleClickAdd(item)}
            style={{
              padding: '12px 14px',
              marginBottom: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            + {item}
          </div>
        ))}
        {available.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
            Đã chuyển tất cả các mục sang vùng sắp xếp.
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: '250px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
          Thứ tự đã sắp xếp (Nhấp để bỏ chọn)
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverActive(true);
          }}
          onDragLeave={() => setDragOverActive(false)}
          onDrop={handleDrop}
          style={{
            minHeight: '140px',
            padding: '12px',
            border: `2px dashed ${dragOverActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            background: dragOverActive ? 'rgba(37, 99, 235, 0.06)' : 'var(--bg-card-alt)',
          }}
        >
          {placed.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', textAlign: 'center', paddingTop: '36px' }}>
              Kéo thả hoặc nhấp vào các mục bên trái theo đúng thứ tự
            </div>
          )}
          {placed.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleRemove(item)}
              style={{
                padding: '11px 14px',
                marginBottom: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--accent-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <span>
                <strong>#{idx + 1}:</strong> {item}
              </span>
              <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>✕</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
