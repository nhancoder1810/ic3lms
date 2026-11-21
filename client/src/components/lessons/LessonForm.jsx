import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import Loading from '../common/Loading';
import styles from './LessonForm.module.css';

const LessonForm = ({ initialData, onSubmit, loading, modules = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'theory',
    module: '',
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        type: initialData.type || 'theory',
        module: initialData.module || '',
        order: initialData.order ?? 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {initialData ? 'Edit Lesson' : 'Create Lesson'}
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            className={styles.input}
            value={formData.title}
            onChange={handleChange}
            placeholder="Lesson title..."
            required
          />
        </div>

        {/* Content */}
        <div className={styles.field}>
          <label className={styles.label}>Content (HTML)</label>
          <textarea
            name="content"
            className={styles.textarea}
            value={formData.content}
            onChange={handleChange}
            placeholder="<h3>Lesson content...</h3>"
          />
        </div>

        {/* Type & Module row */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select
              name="type"
              className={styles.select}
              value={formData.type}
              onChange={handleChange}
            >
              <option value="theory">Theory</option>
              <option value="practice">Practice</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Module</label>
            <select
              name="module"
              className={styles.select}
              value={formData.module}
              onChange={handleChange}
              required
            >
              <option value="">Select module...</option>
              {modules.map((mod) => (
                <option key={mod._id || mod.id} value={mod._id || mod.id}>
                  {mod.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Order */}
        <div className={styles.field}>
          <label className={styles.label}>Order</label>
          <input
            type="number"
            name="order"
            className={styles.input}
            value={formData.order}
            onChange={handleChange}
            min={0}
            style={{ maxWidth: '120px' }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          <FiSave size={16} />
          {loading ? 'Saving...' : initialData ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </form>
    </div>
  );
};

export default LessonForm;
