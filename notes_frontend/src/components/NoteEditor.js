import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./NoteEditor.css";

/**
 * PUBLIC_INTERFACE
 * Editable form for a note.
 * @param {object} props
 * @param {object|null} props.note - {id, title, content}
 * @param {function} props.onChange - (noteDraft) => void, fires on field change
 * @param {function} props.onDelete - () => void
 * @param {function} props.onSave - () => void
 * @param {boolean} props.saving
 * @param {boolean} props.isNew
 */
function NoteEditor({ note, onChange, onDelete, onSave, saving, isNew }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]);

  // Sync up when user edits
  useEffect(() => {
    onChange({ ...note, title, content });
    // eslint-disable-next-line
  }, [title, content]);

  if (!note) {
    return (
      <section className="note-editor-empty">
        <p>Select a note or create a new one.</p>
      </section>
    );
  }

  return (
    <section className="note-editor" aria-labelledby="editor-title">
      <input
        className="note-title"
        placeholder="Note title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-label="Note title"
        maxLength={72}
        autoFocus={isNew}
      />
      <textarea
        className="note-content"
        placeholder="Write your note here…"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={12}
        aria-label="Note content"
      />
      <div className="note-actions">
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={saving || !title.trim()}
        >
          {isNew ? "Create" : "Save"}
        </button>
        {!isNew && (
          <button className="btn-danger" onClick={onDelete} disabled={saving}>
            Delete
          </button>
        )}
      </div>
    </section>
  );
}
NoteEditor.propTypes = {
  note: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  isNew: PropTypes.bool,
};
export default NoteEditor;
