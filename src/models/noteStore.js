/**
 * In-memory note storage with CRUD helpers.
 * Notes are plain objects; each stored note has a string `id` assigned on create.
 */

const notes = [];

let nextId = 1;

function getAll() {
  return notes.map((n) => ({ ...n }));
}

/**
 * @param {Record<string, unknown>} note - Fields for the new note (id is set by the store).
 * @returns {Record<string, unknown>}
 */
function create(note) {
  const id = String(nextId++);
  const record =
    typeof note === "object" && note !== null ? { ...note, id } : { id };
  notes.push(record);
  return { ...record };
}

/**
 * @param {string|number} id
 * @param {Record<string, unknown>} note - Fields to merge into the existing note.
 * @returns {Record<string, unknown>|null} Updated note, or null if not found.
 */
function update(id, note) {
  const idStr = String(id);
  const index = notes.findIndex((n) => String(n.id) === idStr);
  if (index === -1) return null;
  const merged =
    typeof note === "object" && note !== null
      ? { ...notes[index], ...note, id: idStr }
      : { ...notes[index], id: idStr };
  notes[index] = merged;
  return { ...merged };
}

/**
 * @param {string|number} id
 * @returns {boolean} True if a note was removed.
 */
function remove(id) {
  const idStr = String(id);
  const index = notes.findIndex((n) => String(n.id) === idStr);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  create,
  update,
  remove,
};
