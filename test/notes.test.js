'use strict';

const request = require('supertest');
const app = require('../src/index');
const noteStore = require('../src/models/noteStore');

describe('Notes API', () => {
  beforeEach(() => {
    noteStore.reset();
  });

  describe('POST /notes', () => {
    it('creates a note and returns 201 with body', async () => {
      const res = await request(app)
        .post('/notes')
        .send({ content: '  hello  ' })
        .expect(201)
        .expect('Content-Type', /json/);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        content: 'hello',
      });
    });

    it('returns 400 when content is missing', async () => {
      const res = await request(app).post('/notes').send({}).expect(400);

      expect(res.body).toEqual({ error: 'Missing content' });
    });

    it('returns 400 when content is empty or whitespace', async () => {
      await request(app).post('/notes').send({ content: '' }).expect(400);
      await request(app).post('/notes').send({ content: '   ' }).expect(400);
    });
  });

  describe('GET /notes', () => {
    it('returns 200 and an empty array when there are no notes', async () => {
      const res = await request(app).get('/notes').expect(200);

      expect(res.body).toEqual([]);
    });

    it('returns all notes', async () => {
      await request(app).post('/notes').send({ content: 'a' });
      await request(app).post('/notes').send({ content: 'b' });

      const res = await request(app).get('/notes').expect(200);

      expect(res.body).toHaveLength(2);
      expect(res.body.map((n) => n.content).sort()).toEqual(['a', 'b']);
    });
  });

  describe('PUT /notes/:id', () => {
    it('updates a note and returns 200', async () => {
      const created = await request(app)
        .post('/notes')
        .send({ content: 'old' })
        .expect(201);

      const res = await request(app)
        .put(`/notes/${created.body.id}`)
        .send({ content: 'new text' })
        .expect(200);

      expect(res.body).toEqual({
        id: created.body.id,
        content: 'new text',
      });
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app)
        .put('/notes/00000000-0000-4000-8000-000000000000')
        .send({ content: 'x' })
        .expect(404);

      expect(res.body).toEqual({ error: 'Note not found' });
    });

    it('returns 400 when content is missing on update', async () => {
      const created = await request(app)
        .post('/notes')
        .send({ content: 'x' })
        .expect(201);

      const res = await request(app)
        .put(`/notes/${created.body.id}`)
        .send({})
        .expect(400);

      expect(res.body).toEqual({ error: 'Missing content' });
    });
  });

  describe('DELETE /notes/:id', () => {
    it('deletes a note and returns 204', async () => {
      const created = await request(app)
        .post('/notes')
        .send({ content: 'to delete' })
        .expect(201);

      await request(app).delete(`/notes/${created.body.id}`).expect(204);

      const list = await request(app).get('/notes').expect(200);
      expect(list.body).toEqual([]);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app)
        .delete('/notes/00000000-0000-4000-8000-000000000000')
        .expect(404);

      expect(res.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('CORS', () => {
    it('allows any origin', async () => {
      const res = await request(app)
        .options('/notes')
        .set('Origin', 'http://localhost:5173');

      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
