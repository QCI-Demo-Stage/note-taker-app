'use strict';

const crypto = require('node:crypto');

/** @type {Array<{ id: string, content: string }>} */
let notes = [];

/**
 * @returns {Array<{ id: string, content: string }>}
 */
function getAll() {
  return [...notes];
}

/**
 * @param {{ content: string }} note
 * @returns {{ id: string, content: string }}
 */
function create(note) {
  const entry = {
    id: crypto.randomUUID(),
    content: note.content,
  };
  notes.push(entry);
  return entry;
}

/**
 * @param {string} id
 * @param {{ content: string }} note
 * @returns {{ id: string, content: string } | null}
 */
function update(id, note) {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) {
    return null;
  }
  notes[index] = { ...notes[index], content: note.content };
  return notes[index];
}

/**
 * @param {string} id
 * @returns {boolean}
 */
function remove(id) {
  const before = notes.length;
  notes = notes.filter((n) => n.id !== id);
  return notes.length < before;
}

/**
 * Clears all notes (for tests).
 */
function reset() {
  notes = [];
}

module.exports = {
  getAll,
  create,
  update,
  remove,
  reset,
};
