const fsPromises = require('fs/promises');
const os = require('os');
const path = require('path');

describe('persistence fallback on EACCES', () => {
  let writeFileSpy;

  beforeEach(() => {
    jest.resetModules();
    process.env.NOTES_FILE = path.join(
      os.tmpdir(),
      'persistence-fallback-test',
      `notes-${Date.now()}.json`,
    );
    writeFileSpy = jest
      .spyOn(fsPromises, 'writeFile')
      .mockImplementation(() =>
        Promise.reject(
          Object.assign(new Error('permission denied'), { code: 'EACCES' }),
        ),
      );
  });

  afterEach(() => {
    writeFileSpy.mockRestore();
    delete process.env.NOTES_FILE;
  });

  it('disables file writes after permission error and does not throw', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const persistence = require('../src/models/persistence');
    expect(persistence.isFallbackEnabled()).toBe(true);
    await expect(
      persistence.saveNotes([{ id: 'x', content: 'y' }]),
    ).resolves.toBeUndefined();
    expect(persistence.isFallbackEnabled()).toBe(false);
    expect(writeFileSpy).toHaveBeenCalledTimes(1);
    await expect(
      persistence.saveNotes([{ id: 'x', content: 'z' }]),
    ).resolves.toBeUndefined();
    expect(writeFileSpy).toHaveBeenCalledTimes(1);
    console.warn.mockRestore();
  });

  it('API create still succeeds after persistence falls back', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const request = require('supertest');
    const app = require('../src/index');
    const res = await request(app)
      .post('/notes')
      .send({ content: 'survives' })
      .expect(201);
    expect(res.body.content).toBe('survives');
    expect(res.body.id).toBeDefined();
    console.warn.mockRestore();
  });
});
