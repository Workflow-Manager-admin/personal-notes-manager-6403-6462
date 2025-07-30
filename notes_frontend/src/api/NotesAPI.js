const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:8000/api";

// PUBLIC_INTERFACE
/**
 * Lists all notes (optionally search by query).
 * @param {string} [query]
 * @returns {Promise<Array<{id,title,content,created,updated}>>}
 */
export async function listNotes(query) {
  const params = query ? "?q=" + encodeURIComponent(query) : "";
  const r = await fetch(API_BASE + "/notes" + params);
  if (!r.ok) throw new Error("Failed to fetch notes");
  return r.json();
}

// PUBLIC_INTERFACE
/**
 * Loads a single note by id
 * @param {string} id
 */
export async function getNote(id) {
  const r = await fetch(API_BASE + "/notes/" + id);
  if (!r.ok) throw new Error("Note not found");
  return r.json();
}

// PUBLIC_INTERFACE
/**
 * Creates a new note ({title, content})
 * @param {object} data
 */
export async function createNote(data) {
  const r = await fetch(API_BASE + "/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create note");
  return r.json();
}

// PUBLIC_INTERFACE
/**
 * Updates an existing note by id ({title, content})
 * @param {string} id
 * @param {object} data
 */
export async function updateNote(id, data) {
  const r = await fetch(API_BASE + "/notes/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to update note");
  return r.json();
}

// PUBLIC_INTERFACE
/**
 * Deletes a note by id
 * @param {string} id
 */
export async function deleteNote(id) {
  const r = await fetch(API_BASE + "/notes/" + id, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("Failed to delete note");
}
