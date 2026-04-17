const request = require('supertest');

describe('Notes CRUD API', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../src/index');
  });

  describe('POST /notes', () => {
    it('creates a note and returns 201 with id and content', async () => {
      const res = await request(app)
        .post('/notes')
        .send({ content: 'Hello' })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toMatchObject({
        content: 'Hello',
      });
      expect(res.body.id).toBeDefined();
      expect(typeof res.body.id).toBe('string');
    });

    it('returns 400 when content is missing', async () => {
      const res = await request(app).post('/notes').send({}).expect(400);

      expect(res.body).toEqual({ error: 'Missing content' });
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(app).post('/notes').send().expect(400);

      expect(res.body).toEqual({ error: 'Missing content' });
    });
  });

  describe('GET /notes', () => {
    it('returns an array including created notes', async () => {
      const createRes = await request(app)
        .post('/notes')
        .send({ content: 'Listed' })
        .expect(201);

      const res = await request(app).get('/notes').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createRes.body.id,
            content: 'Listed',
          }),
        ]),
      );
    });
  });

  describe('PUT /notes/:id', () => {
    it('updates a note and returns 200', async () => {
      const { body: created } = await request(app)
        .post('/notes')
        .send({ content: 'Before' })
        .expect(201);

      const res = await request(app)
        .put(`/notes/${created.id}`)
        .send({ content: 'After' })
        .expect(200);

      expect(res.body).toEqual({
        id: created.id,
        content: 'After',
      });
    });

    it('returns 404 when id does not exist', async () => {
      const res = await request(app)
        .put('/notes/00000000-0000-0000-0000-000000000000')
        .send({ content: 'x' })
        .expect(404);

      expect(res.body).toEqual({ error: 'Note not found' });
    });

    it('returns 400 when content is missing on update', async () => {
      const { body: created } = await request(app)
        .post('/notes')
        .send({ content: 'Ok' })
        .expect(201);

      const res = await request(app)
        .put(`/notes/${created.id}`)
        .send({})
        .expect(400);

      expect(res.body).toEqual({ error: 'Missing content' });
    });
  });

  describe('DELETE /notes/:id', () => {
    it('deletes a note and returns 204', async () => {
      const { body: created } = await request(app)
        .post('/notes')
        .send({ content: 'Remove me' })
        .expect(201);

      await request(app).delete(`/notes/${created.id}`).expect(204);

      const list = await request(app).get('/notes').expect(200);
      expect(list.body.find((n) => n.id === created.id)).toBeUndefined();
    });

    it('returns 404 when id does not exist', async () => {
      const res = await request(app)
        .delete('/notes/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('CORS', () => {
    it('includes Access-Control-Allow-Origin for preflight', async () => {
      const res = await request(app)
        .options('/notes')
        .set('Origin', 'http://localhost:5173')
        .expect(204);

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
