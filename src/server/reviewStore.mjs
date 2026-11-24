import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { reviewKeys } from '#shared/scenario';

// Windows readers can temporarily lock the file against reads or atomic replacement.
async function withFileLockRetry(operation) {
  for (let retry = 0; ; retry++) {
    try {
      return await operation();
    } catch (error) {
      if (process.platform !== 'win32' || retry >= 6 || !['EBUSY', 'EPERM', 'EACCES'].includes(error.code)) throw error;
      await delay(50 * 2 ** retry);
    }
  }
}

async function writeReview(file, record) {
  const records = JSON.parse(await withFileLockRetry(() => readFile(file, 'utf8')));
  if (!Array.isArray(records)) throw new Error('Invalid information file');
  const existing = records.find(item => item.id === record.id);
  if (existing) {
    return existing.phrase === record.phrase && reviewKeys.every(key => existing[key] === record[key]) ? 200 : 409;
  }
  // A submission without tile IDs can only be a retry of a pre-phrase record.
  if (record.phrase === undefined) return 400;
  records.push({ ...record, savedAt: new Date().toISOString() });
  const temporary = file + '.' + randomUUID() + '.tmp';
  try {
    await writeFile(temporary, JSON.stringify(records, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    await withFileLockRetry(() => rename(temporary, file));
  } catch (error) {
    await withFileLockRetry(() => rm(temporary, { force: true }));
    throw error;
  }
  return 201;
}

export async function openReviewStore(file) {
  await mkdir(dirname(file), { recursive: true });
  try {
    await writeFile(file, '[]\n', { flag: 'wx', mode: 0o600 });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }

  // Serialize the full read-modify-write operation, including retries.
  let writes = Promise.resolve();
  return function saveSubmission(record) {
    const pending = writes.then(() => writeReview(file, record));
    writes = pending.catch(() => {});
    return pending;
  };
}
