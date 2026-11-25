import { useEffect, useState } from 'react';
import { reviewKeys, validReviewField } from '#shared/scenario';

export const fields = [
  ['caseId', 'Case ID', 'case'], ['email', 'Sample email', 'email'],
  ['emailChange', 'Email change', 'activity'], ['loginAttempt', 'Login attempt', 'login'],
  ['balanceBand', 'Balance range', 'balance'], ['contactReview', 'Contact review', 'contact'],
  ['device', 'Device preview', 'devices'], ['layoutSize', 'Layout size', 'layout'],
];

function newDraft() { return { id: crypto.randomUUID() }; }
function loadDraft(storageKey) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(storageKey));
    if (cached && typeof cached.id === 'string') {
      const draft = { id: cached.id, saved: cached.saved === true && validReviewField('caseId', cached.caseId) };
      for (const key of reviewKeys) {
        if (validReviewField(key, cached[key])) draft[key] = cached[key];
      }
      return draft;
    }
  } catch { /* A review can run in memory when browser storage is unavailable. */ }
  return newDraft();
}

export function useReviewDraft(storageKey) {
  const [draft, setDraft] = useState(() => loadDraft(storageKey));
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(draft)); } catch { /* Keep the current tab usable. */ }
  }, [draft, storageKey]);
  function setField(key, value, { newRevision = false } = {}) {
    if (!validReviewField(key, value)) return;
    setDraft(old => old[key] === value && !newRevision ? old : { ...old, [key]: value, id: crypto.randomUUID(), saved: false });
  }
  function saved(record) {
    setDraft(old => old.id === record.id ? { ...old, saved: true } : old);
  }
  return { draft, setField, saved, reset: () => setDraft(newDraft()) };
}
