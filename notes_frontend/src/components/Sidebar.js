import React from "react";
import PropTypes from "prop-types";
import "./Sidebar.css";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation for listing notes.
 * @param {Object} props
 * @param {Array} props.notes - array of note objects with id, title
 * @param {string} props.selectedId - currently selected note id
 * @param {function} props.onSelect - (id: string) => void
 * @param {function} props.onCreate - () => void
 * @param {string} props.query - search query
 * @param {function} props.onSearch - (query: string) => void
 */
function Sidebar({
  notes,
  selectedId,
  onSelect,
  onCreate,
  query,
  onSearch,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Notes</h1>
        <button
          className="sidebar-new"
          onClick={onCreate}
          aria-label="New Note"
          title="New Note"
        >
          ＋
        </button>
      </div>
      <input
        className="sidebar-search"
        placeholder="Search notes…"
        value={query}
        onChange={e => onSearch(e.target.value)}
        aria-label="Search notes"
      />
      <ul className="sidebar-list" role="list">
        {notes.length === 0 && (
          <li className="sidebar-empty">No notes found.</li>
        )}
        {notes.map(note => (
          <li
            key={note.id}
            className={
              "sidebar-note" + (note.id === selectedId ? " selected" : "")
            }
            onClick={() => onSelect(note.id)}
            tabIndex={0}
            aria-current={note.id === selectedId}
          >
            <span className="sidebar-note-title">
              {note.title.trim() ? note.title : <em>(Untitled)</em>}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  notes: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  query: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default Sidebar;

