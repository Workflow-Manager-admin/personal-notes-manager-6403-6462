import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import "./components/Sidebar.css";
import "./components/NoteEditor.css";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "./api/NotesAPI";

// Color theme CSS variables setup (for brand colors)
const colors = {
  "--primary": "#1976d2",
  "--secondary": "#424242",
  "--accent": "#ffb300",
  "--sidebar-bg": "#f8f9fa",
  "--bg-panel": "#fff",
  "--border-color": "#e9ecef",
  "--accent-bg": "#fff3e0",
};

function applyColors() {
  for (const k in colors) {
    document.documentElement.style.setProperty(k, colors[k]);
  }
}

/**
 * PUBLIC_INTERFACE
 * Main App component for Notes UI.
 */
function App() {
  const [theme] = useState("light"); // always light for minimal design
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState("");

  // Initial load and theme/color setup
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    applyColors();
    loadNotes();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  // Loads all notes for list (with optional query)
  const loadNotes = useCallback(async (query) => {
    setFetching(true);
    setLastError("");
    try {
      const data = await listNotes(query);
      setNotes(data);
      // If list changed (e.g., a note was deleted), adjust selected note
      if (selectedId && !data.find(n => n.id === selectedId)) {
        setSelectedId(data[0]?.id || null);
      }
    } catch (e) {
      setLastError(e.message || "Could not load notes. Please try again.");
    }
    setFetching(false);
  }, [selectedId]);

  // Whenever selectedId changes, fetch note
  useEffect(() => {
    if (selectedId) {
      setSaving(false);
      setIsNew(false);
      setLastError("");
      getNote(selectedId)
        .then(n => {
          setCurrentNote(n);
          setCurrentDraft(n);
        })
        .catch(e => {
          setCurrentNote(null);
          setLastError(e.message || "Failed to load note.");
        });
    } else {
      setCurrentNote(null);
      setCurrentDraft(null);
      setIsNew(false);
    }
  }, [selectedId]);

  // Handle search
  const handleSearch = (query) => {
    setSearch(query);
    loadNotes(query);
  };

  // New note
  const handleCreateNote = () => {
    setCurrentNote({ title: "", content: "" });
    setCurrentDraft({ title: "", content: "" });
    setIsNew(true);
    setSelectedId(null);
  };

  // Select note from sidebar list
  const handleSelectNote = (id) => {
    setSelectedId(id);
    setIsNew(false);
  };

  // Draft edit
  const handleDraftChange = (draft) => setCurrentDraft(draft);

  // Save (create or update)
  const handleSaveNote = async () => {
    setSaving(true);
    setLastError("");
    try {
      if (isNew) {
        const created = await createNote({
          title: currentDraft.title || "",
          content: currentDraft.content || "",
        });
        await loadNotes(search);
        setIsNew(false);
        setSelectedId(created.id);
      } else if (currentNote?.id) {
        await updateNote(currentNote.id, {
          title: currentDraft.title,
          content: currentDraft.content,
        });
        await loadNotes(search);
      }
    } catch (e) {
      setLastError(e.message || "Save failed.");
    }
    setSaving(false);
  };

  // Delete
  const handleDeleteNote = async () => {
    if (!window.confirm("Delete this note?")) return;
    setSaving(true);
    setLastError("");
    try {
      await deleteNote(currentNote.id);
      await loadNotes(search);
      setSelectedId(notes.length > 1 ? notes[0].id : null);
      setCurrentNote(null);
      setIsNew(false);
    } catch (e) {
      setLastError(e.message || "Delete failed.");
    }
    setSaving(false);
  };

  // Keyboard: allow Cmd+S/CTRL+S to save note
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (currentDraft && ((isNew && (currentDraft.title || currentDraft.content)) ||
          (!isNew && JSON.stringify(currentDraft) !== JSON.stringify(currentNote)))) {
          handleSaveNote();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line
  });

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg-primary, #fff)"
    }}>
      <Sidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={handleSelectNote}
        onCreate={handleCreateNote}
        query={search}
        onSearch={handleSearch}
      />
      <main style={{
        flex: 1,
        minWidth: 0,
        background: "var(--bg-panel, #fff)",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <header style={{
          height: 60,
          borderBottom: "1px solid var(--border-color, #e9ecef)",
          display: "flex",
          alignItems: "center",
          padding: "0 2em",
          background: "var(--bg-secondary, #f8f9fa)",
          fontWeight: 500,
          color: "var(--primary, #1976d2)",
          fontSize: "1.17rem",
          letterSpacing: "1.4px",
        }}>
          Personal Notes
        </header>
        {lastError && (
          <div style={{
            background: "#fffbe6",
            color: "#b86f00",
            borderBottom: "1px solid #ffe9b6",
            padding: "0.9em 2.2em",
            fontSize: "1em"
          }}>
            {lastError}
          </div>
        )}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}>
          <NoteEditor
            note={isNew ? currentDraft : currentNote}
            onChange={handleDraftChange}
            onDelete={isNew ? undefined : handleDeleteNote}
            onSave={handleSaveNote}
            saving={saving}
            isNew={isNew}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
