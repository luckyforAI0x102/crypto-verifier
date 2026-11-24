import express from 'express';
import { choices, demoTiles, reviewKeys, validTileIds } from '#shared/scenario';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const { tileIds, ...record } = body;
  if (Object.keys(record).length !== reviewKeys.length + 1
    || typeof record.id !== 'string' || !uuid.test(record.id)
    || !reviewKeys.every(key => choices[key].includes(record[key]))) return null;
  if (tileIds !== undefined) {
    if (!validTileIds(tileIds, record.layoutSize)) return null;
    record.phrase = tileIds.map(id => demoTiles[id - 1]).join(' ');
  }
  return record;
}

export function createApp({ publicDir, saveSubmission }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '4kb' }));
  app.post('/api/submissions', async (req, res) => {
    const record = parseSubmission(req.body);
    if (!record) return res.status(400).json({ error: 'Choose a sample option for each review field and practice tile.' });
    const status = await saveSubmission(record);
    if (status === 400) return res.status(400).json({ error: 'Complete the practice phrase before saving.' });
    if (status === 409) return res.status(409).json({ error: 'This submission ID already belongs to another review.' });
    res.status(status).json({ saved: true, id: req.body.id });
  });
  if (publicDir) app.use(express.static(publicDir));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.status === 400 || error.status === 413) {
      return res.status(error.status).json({ error: 'Invalid submission body.' });
    }
    console.error('Unable to process the request:', error.code || error.name);
    res.status(500).json({ error: 'The review could not be saved. Please try again.' });
  });
  return app;
}
