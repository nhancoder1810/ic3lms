import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import Loading from '../common/Loading';
import styles from './CourseForm.module.css';

const emptyLesson = () => ({ title: '', type: 'theory' });
const emptyModule = () => ({ title: '', lessons: [emptyLesson()] });

const CourseForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'ic3-spark',
    thumbnail: '',
    isPublished: false,
    modules: [emptyModule()],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'ic3-spark',
        thumbnail: initialData.thumbnail || '',
        isPublished: initialData.isPublished || false,
        modules:
          initialData.modules && initialData.modules.length > 0
            ? initialData.modules.map((m) => ({
                title: m.title || '',
                lessons:
                  m.lessons && m.lessons.length > 0
                    ? m.lessons.map((l) => ({
                        title: typeof l === 'object' ? l.title || '' : '',
                        type: typeof l === 'object' ? l.type || 'theory' : 'theory',
                      }))
                    : [emptyLesson()],
              }))
            : [emptyModule()],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* Module helpers */
  const addModule = () => {
    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, emptyModule()],
    }));
  };

  const removeModule = (mIdx) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== mIdx),
    }));
  };

  const updateModuleTitle = (mIdx, value) => {
    setForm((prev) => {
      const modules = [...prev.modules];
      modules[mIdx] = { ...modules[mIdx], title: value };
      return { ...prev, modules };
    });
  };

  /* Lesson helpers */
  const addLesson = (mIdx) => {
    setForm((prev) => {
      const modules = [...prev.modules];
      modules[mIdx] = {
        ...modules[mIdx],
        lessons: [...modules[mIdx].lessons, emptyLesson()],
      };
      return { ...prev, modules };
    });
  };

  const removeLesson = (mIdx, lIdx) => {
    setForm((prev) => {
      const modules = [...prev.modules];
      modules[mIdx] = {
        ...modules[mIdx],
        lessons: modules[mIdx].lessons.filter((_, i) => i !== lIdx),
      };
      return { ...prev, modules };
    });
  };

  const updateLesson = (mIdx, lIdx, field, value) => {
    setForm((prev) => {
      const modules = [...prev.modules];
      const lessons = [...modules[mIdx].lessons];
      lessons[lIdx] = { ...lessons[lIdx], [field]: value };
      modules[mIdx] = { ...modules[mIdx], lessons };
      return { ...prev, modules };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Basic info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Course Details</h2>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Course title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Course description..."
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="ic3-spark">IC3 Spark</option>
            <option value="ic3-gs6">IC3 GS6</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Thumbnail URL</label>
          <input
            className={styles.input}
            type="url"
            placeholder="https://example.com/thumbnail.jpg"
            value={form.thumbnail}
            onChange={(e) => handleChange('thumbnail', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.toggleRow}>
            <label className={styles.toggle}>
              <input
                className={styles.toggleInput}
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
              />
              <span className={styles.toggleSlider} />
            </label>
            <span className={styles.toggleLabel}>Published</span>
          </div>
        </div>
      </div>

      {/* Module builder */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Modules &amp; Lessons</h2>

        {form.modules.map((mod, mIdx) => (
          <div key={mIdx} className={styles.moduleCard}>
            <div className={styles.moduleHeader}>
              <input
                className={styles.input}
                type="text"
                placeholder={`Module ${mIdx + 1} title`}
                value={mod.title}
                onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeModule(mIdx)}
                title="Remove module"
              >
                <FiTrash2 />
              </button>
            </div>

            {mod.lessons.map((lesson, lIdx) => (
              <div key={lIdx} className={styles.lessonRow}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder={`Lesson ${lIdx + 1} title`}
                  value={lesson.title}
                  onChange={(e) =>
                    updateLesson(mIdx, lIdx, 'title', e.target.value)
                  }
                />
                <select
                  className={styles.select}
                  value={lesson.type}
                  onChange={(e) =>
                    updateLesson(mIdx, lIdx, 'type', e.target.value)
                  }
                >
                  <option value="theory">Theory</option>
                  <option value="practice">Practice</option>
                  <option value="video">Video</option>
                </select>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeLesson(mIdx, lIdx)}
                  title="Remove lesson"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <button
              type="button"
              className={styles.addBtn}
              onClick={() => addLesson(mIdx)}
              title="Add lesson"
              style={{ marginTop: '0.25rem' }}
            >
              <FiPlus />
            </button>
          </div>
        ))}

        <button type="button" className={styles.addModuleBtn} onClick={addModule}>
          <FiPlus /> Add Module
        </button>
      </div>

      {/* Submit */}
      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? (
          'Saving...'
        ) : (
          <>
            <FiSave /> {initialData ? 'Update Course' : 'Create Course'}
          </>
        )}
      </button>
    </form>
  );
};

export default CourseForm;
