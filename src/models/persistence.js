const fs = require('fs/promises');
const path = require('path');

const NOTES_FILE =
  process.env.NOTES_FILE || path.join(process.cwd(), 'data', 'notes.json');

/** When false, disk writes are skipped after a permission error; data stays in memory. */
let fallbackEnabled = true;

function isPermissionError(err) {
  return err && (err.code === 'EACCES' || err.code === 'EPERM');
}

/**
 * @returns {Promise<{ id: string, content: string }[]>}
 */
async function loadNotes() {
  try {
    const raw = await fs.readFile(NOTES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((n) => ({
      id: String(n.id),
      content: String(n.content),
    }));
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

/**
 * @param {{ id: string, content: string }[]} notes
 */
async function saveNotes(notes) {
  if (!fallbackEnabled) {
    return;
  }
  try {
    await fs.mkdir(path.dirname(NOTES_FILE), { recursive: true });
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf8');
  } catch (err) {
    if (isPermissionError(err)) {
      fallbackEnabled = false;
      // eslint-disable-next-line no-console
      console.warn(
        '[persistence] File write failed (%s); continuing in-memory only.',
        err.code,
      );
      return;
    }
    throw err;
  }
}

function isFallbackEnabled() {
  return fallbackEnabled;
}

function resetPersistenceStateForTests() {
  fallbackEnabled = true;
}

module.exports = {
  loadNotes,
  saveNotes,
  isFallbackEnabled,
  resetPersistenceStateForTests,
  NOTES_FILE,
};
