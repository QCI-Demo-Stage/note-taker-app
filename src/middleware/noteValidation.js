const noteStore = require('../models/noteStore');

function hasMissingContent(body) {
  if (!body || typeof body !== 'object') {
    return true;
  }
  const { content } = body;
  return content === undefined || content === null;
}

function validateCreateBody(req, res, next) {
  if (hasMissingContent(req.body)) {
    return res.status(400).json({ error: 'Missing content' });
  }
  next();
}

function validateUpdateBody(req, res, next) {
  if (hasMissingContent(req.body)) {
    return res.status(400).json({ error: 'Missing content' });
  }
  next();
}

function validateNoteExists(req, res, next) {
  const { id } = req.params;
  const exists = noteStore.getAll().some((n) => n.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Note not found' });
  }
  next();
}

module.exports = {
  validateCreateBody,
  validateUpdateBody,
  validateNoteExists,
};
