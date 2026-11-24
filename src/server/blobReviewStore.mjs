import { BlobPreconditionFailedError, get, put } from '@vercel/blob';
import { setTimeout as delay } from 'node:timers/promises';
import { appendReview } from './reviewRecords.mjs';

const pathname = 'informations.json';
const readLatest = () => get(pathname, { access: 'private', useCache: false });

export async function saveBlobSubmission(record) {
  let current = await readLatest();
  for (let attempt = 0; ; attempt++) {
    const records = current ? await new Response(current.stream).json() : [];
    const status = appendReview(records, record);
    if (status !== 201) return status;
    if (current && !current.blob.etag) throw new Error('Missing information file version');

    try {
      await put(pathname, JSON.stringify(records, null, 2) + '\n', {
        access: 'private',
        contentType: 'application/json',
        ...(current ? { allowOverwrite: true, ifMatch: current.blob.etag } : { allowOverwrite: false }),
      });
      return 201;
    } catch (error) {
      // Competing first writes use create-only mode. Later writes must match the version read.
      if (attempt >= 5 || (current && !(error instanceof BlobPreconditionFailedError))) throw error;
      await delay(40 * 2 ** attempt + Math.random() * 40);
      current = await readLatest();
      if (!current) throw error;
    }
  }
}
