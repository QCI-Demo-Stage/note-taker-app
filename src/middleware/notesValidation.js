/**
 * Request validation and existence checks for /notes routes.
 */

const noteStore = require("../models/noteStore");

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValidContent(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateCreateBody(req, res, next) {
  if (!isPlainObject(req.body)) {
    return res
      .status(400)
      .json({ error: "Request body must be a JSON object" });
  }
  if (!hasValidContent(req.body.content)) {
    return res.status(400).json({ error: "Missing content" });
  }
  return next();
}

function validateUpdateBody(req, res, next) {
  if (!isPlainObject(req.body)) {
    return res
      .status(400)
      .json({ error: "Request body must be a JSON object" });
  }
  if (!hasValidContent(req.body.content)) {
    return res.status(400).json({ error: "Missing content" });
  }
  return next();
}

function requireNoteExists(req, res, next) {
  const { id } = req.params;
  if (!noteStore.getById(id)) {
    return res.status(404).json({ error: "Note not found" });
  }
  return next();
}

module.exports = {
  isPlainObject,
  validateCreateBody,
  validateUpdateBody,
  requireNoteExists,
};
