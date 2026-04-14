/**
 * In-memory note persistence (replaceable in tests via createApp deps).
 */

const notes = [];
let nextId = 1;

function listNotes() {
  return Promise.resolve(notes.map((n) => ({ ...n })));
}

function createNote({ title, body = '' }) {
  const note = {
    id: String(nextId++),
    title,
    body: body ?? '',
  };
  notes.push(note);
  return Promise.resolve({ ...note });
}

function findById(id) {
  return notes.find((n) => n.id === String(id)) ?? null;
}

function updateNote(id, { title, body }) {
  const idx = notes.findIndex((n) => n.id === String(id));
  if (idx === -1) return Promise.resolve(null);
  if (title !== undefined) notes[idx].title = title;
  if (body !== undefined) notes[idx].body = body;
  return Promise.resolve({ ...notes[idx] });
}

function deleteNote(id) {
  const idx = notes.findIndex((n) => n.id === String(id));
  if (idx === -1) return Promise.resolve(false);
  notes.splice(idx, 1);
  return Promise.resolve(true);
}

module.exports = {
  listNotes,
  createNote,
  findById,
  updateNote,
  deleteNote,
};
