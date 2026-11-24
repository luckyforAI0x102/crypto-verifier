import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { appendReview } from './reviewRecords.mjs';

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
  const status = appendReview(records, record);
  if (status !== 201) return status;
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
