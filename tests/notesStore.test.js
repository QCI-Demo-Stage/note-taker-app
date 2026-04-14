describe('notesStore', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('lists, creates, finds, updates, and deletes notes', async () => {
    const store = require('../src/notesStore');
    expect(await store.listNotes()).toEqual([]);

    const created = await store.createNote({ title: 'A', body: 'b' });
    expect(created).toMatchObject({ title: 'A', body: 'b' });
    expect(created.id).toBeDefined();

    expect(await store.findById(created.id)).toMatchObject({ title: 'A', body: 'b' });
    expect(await store.listNotes()).toHaveLength(1);

    const updated = await store.updateNote(created.id, { title: 'B', body: 'c' });
    expect(updated).toMatchObject({ title: 'B', body: 'c' });

    expect(await store.deleteNote(created.id)).toBe(true);
    expect(await store.listNotes()).toEqual([]);
  });

  it('returns null from updateNote when id is missing', async () => {
    const store = require('../src/notesStore');
    expect(await store.updateNote('missing', { title: 'x' })).toBeNull();
  });

  it('returns false from deleteNote when id is missing', async () => {
    const store = require('../src/notesStore');
    expect(await store.deleteNote('missing')).toBe(false);
  });

  it('returns null from findById when id is missing', async () => {
    const store = require('../src/notesStore');
    expect(store.findById('nope')).toBeNull();
  });

  it('normalizes null body on create and supports partial updates', async () => {
    const store = require('../src/notesStore');
    const noBodyArg = await store.createNote({ title: 'NoBodyArg' });
    expect(noBodyArg.body).toBe('');

    const created = await store.createNote({ title: 'T', body: null });
    expect(created.body).toBe('');

    const id = created.id;
    const titleOnly = await store.updateNote(id, { title: 'OnlyTitle' });
    expect(titleOnly).toMatchObject({ title: 'OnlyTitle', body: '' });

    const bodyOnly = await store.updateNote(id, { body: 'OnlyBody' });
    expect(bodyOnly).toMatchObject({ title: 'OnlyTitle', body: 'OnlyBody' });
  });
});
