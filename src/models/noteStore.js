const crypto = require('crypto');

/** @type {{ id: string, content: string }[]} */
const notes = [];

function getAll() {
  return notes.map((n) => ({ ...n }));
}

/**
 * @param {{ content: unknown }} note
 * @returns {{ id: string, content: string }}
 */
function create(note) {
  const id = crypto.randomUUID();
  const record = { id, content: String(note.content) };
  notes.push(record);
  return { ...record };
}

/**
 * @param {string} id
 * @param {{ content: unknown }} note
 * @returns {{ id: string, content: string } | null}
 */
function update(id, note) {
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return null;
  }
  notes[idx] = { ...notes[idx], content: String(note.content) };
  return { ...notes[idx] };
}

/**
 * @param {string} id
 * @returns {boolean}
 */
function remove(id) {
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return false;
  }
  notes.splice(idx, 1);
  return true;
}

module.exports = {
  getAll,
  create,
  update,
  remove,
};
