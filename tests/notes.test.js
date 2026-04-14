const request = require('supertest');
const { createApp } = require('../src/app');

describe('GET /notes', () => {
  it('returns 200 and an array when the datastore is empty', async () => {
    const listNotes = jest.fn().mockResolvedValue([]);
    const app = createApp({ listNotes });
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
  });

  it('returns 500 when the data layer throws', async () => {
    const listNotes = jest.fn().mockRejectedValue(new Error('db down'));
    const app = createApp({ listNotes });
    const res = await request(app).get('/notes');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to list notes' });
  });
});

describe('POST /notes', () => {
  it('returns 201 and the created note for a valid payload', async () => {
    const created = { id: '1', title: 'Hello', body: 'World' };
    const createNote = jest.fn().mockResolvedValue(created);
    const app = createApp({ createNote });
    const res = await request(app)
      .post('/notes')
      .send({ title: '  Hello  ', body: 'World' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(createNote).toHaveBeenCalledWith({ title: 'Hello', body: 'World' });
  });

  it('returns 400 when title is missing', async () => {
    const createNote = jest.fn();
    const app = createApp({ createNote });
    const res = await request(app).post('/notes').send({ body: 'only body' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Title is required' });
    expect(createNote).not.toHaveBeenCalled();
  });

  it('coerces non-string body to an empty string', async () => {
    const createNote = jest
      .fn()
      .mockResolvedValue({ id: '1', title: 'T', body: '' });
    const app = createApp({ createNote });
    const res = await request(app)
      .post('/notes')
      .send({ title: 'T', body: 123 });
    expect(res.status).toBe(201);
    expect(createNote).toHaveBeenCalledWith({ title: 'T', body: '' });
  });
});

describe('PUT /notes/:id', () => {
  it('returns 200 and the updated note when the id exists', async () => {
    const updated = { id: '42', title: 'New', body: 'Text' };
    const updateNote = jest.fn().mockResolvedValue(updated);
    const app = createApp({ updateNote });
    const res = await request(app)
      .put('/notes/42')
      .send({ title: 'New', body: 'Text' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
    expect(updateNote).toHaveBeenCalledWith('42', { title: 'New', body: 'Text' });
  });

  it('returns 404 when the id does not exist', async () => {
    const updateNote = jest.fn().mockResolvedValue(null);
    const app = createApp({ updateNote });
    const res = await request(app)
      .put('/notes/unknown')
      .send({ title: 'x' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});

describe('DELETE /notes/:id', () => {
  it('returns 204 when the note exists', async () => {
    const deleteNote = jest.fn().mockResolvedValue(true);
    const app = createApp({ deleteNote });
    const res = await request(app).delete('/notes/7');
    expect(res.status).toBe(204);
    expect(deleteNote).toHaveBeenCalledTimes(1);
    expect(deleteNote).toHaveBeenCalledWith('7');
  });

  it('returns 404 when the id is invalid or missing', async () => {
    const deleteNote = jest.fn().mockResolvedValue(false);
    const app = createApp({ deleteNote });
    const res = await request(app).delete('/notes/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
    expect(deleteNote).toHaveBeenCalledTimes(1);
    expect(deleteNote).toHaveBeenCalledWith('999');
  });
});
