const fs = require('fs/promises');
const os = require('os');
const path = require('path');

describe('persistence module', () => {
  let tmpDir;

  beforeEach(async () => {
    jest.resetModules();
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'persistence-test-'));
    process.env.NOTES_FILE = path.join(tmpDir, 'notes.json');
  });

  afterEach(() => {
    delete process.env.NOTES_FILE;
  });

  it('loadNotes returns empty array when file is missing', async () => {
    const { loadNotes } = require('../src/models/persistence');
    const notes = await loadNotes();
    expect(notes).toEqual([]);
  });

  it('saveNotes creates file with correct JSON and loadNotes reads it back', async () => {
    const persistence = require('../src/models/persistence');
    const sample = [
      { id: 'a', content: 'one' },
      { id: 'b', content: 'two' },
    ];
    await persistence.saveNotes(sample);
    const loaded = await persistence.loadNotes();
    expect(loaded).toEqual(sample);
    const raw = await fs.readFile(process.env.NOTES_FILE, 'utf8');
    expect(JSON.parse(raw)).toEqual(sample);
  });
});
