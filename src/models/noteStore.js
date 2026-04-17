const crypto = require('crypto');
const { loadNotes, saveNotes } = require('./persistence');

/** @type {{ id: string, content: string }[]} */
const notes = [];

const readyPromise = (async function init() {
  const loaded = await loadNotes();
  notes.splice(0, notes.length, ...loaded);
})();

function ready() {
  return readyPromise;
}

async function getAll() {
  await readyPromise;
  return notes.map((n) => ({ ...n }));
}

/**
 * @param {{ content: unknown }} note
 * @returns {Promise<{ id: string, content: string }>}
 */
async function create(note) {
  await readyPromise;
  const id = crypto.randomUUID();
  const record = { id, content: String(note.content) };
  notes.push(record);
  await saveNotes(notes);
  return { ...record };
}

/**
 * @param {string} id
 * @param {{ content: unknown }} note
 * @returns {Promise<{ id: string, content: string } | null>}
 */
async function update(id, note) {
  await readyPromise;
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return null;
  }
  notes[idx] = { ...notes[idx], content: String(note.content) };
  await saveNotes(notes);
  return { ...notes[idx] };
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function remove(id) {
  await readyPromise;
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return false;
  }
  notes.splice(idx, 1);
  await saveNotes(notes);
  return true;
}

module.exports = {
  ready,
  getAll,
  create,
  update,
  remove,
};
