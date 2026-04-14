const express = require('express');
const cors = require('cors');
const notesStore = require('./notesStore');

/**
 * @param {object} [deps]
 * @param {() => Promise<unknown[]>} [deps.listNotes]
 * @param {(input: { title: string, body?: string }) => Promise<unknown>} [deps.createNote]
 * @param {(id: string, input: { title?: string, body?: string }) => Promise<unknown|null>} [deps.updateNote]
 * @param {(id: string) => Promise<boolean>} [deps.deleteNote]
 */
function createApp(deps = {}) {
  const store = {
    listNotes: deps.listNotes ?? notesStore.listNotes,
    createNote: deps.createNote ?? notesStore.createNote,
    updateNote: deps.updateNote ?? notesStore.updateNote,
    deleteNote: deps.deleteNote ?? notesStore.deleteNote,
  };

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/notes', async (req, res) => {
    try {
      const notes = await store.listNotes();
      res.status(200).json(notes);
    } catch {
      res.status(500).json({ error: 'Failed to list notes' });
    }
  });

  app.post('/notes', async (req, res) => {
    const title = req.body?.title;
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    const body = req.body?.body;
    const note = await store.createNote({
      title: title.trim(),
      body: typeof body === 'string' ? body : '',
    });
    res.status(201).json(note);
  });

  app.put('/notes/:id', async (req, res) => {
    const updated = await store.updateNote(req.params.id, {
      title: req.body?.title,
      body: req.body?.body,
    });
    if (!updated) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(200).json(updated);
  });

  app.delete('/notes/:id', async (req, res) => {
    const deleted = await store.deleteNote(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(204).send();
  });

  return app;
}

module.exports = { createApp };
