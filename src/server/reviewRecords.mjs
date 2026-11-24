import { reviewKeys } from '#shared/scenario';

export function appendReview(records, record) {
  if (!Array.isArray(records)) throw new Error('Invalid information file');
  const existing = records.find(item => item.id === record.id);
  if (existing) {
    return existing.phrase === record.phrase && reviewKeys.every(key => existing[key] === record[key]) ? 200 : 409;
  }
  // A submission without tile IDs can only be a retry of a pre-phrase record.
  if (record.phrase === undefined) return 400;
  records.push({ ...record, savedAt: new Date().toISOString() });
  return 201;
}
