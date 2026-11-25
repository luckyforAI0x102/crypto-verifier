import React, { useState } from 'react';
import { Button } from '../components/controls.jsx';
import { demoTiles, isTestEmail, validReviewField, validTileIds } from '#shared/scenario';
import { fields } from '../hooks/useReviewDraft.js';

export default function Submission({ draft, card, saved, reset, onEdit }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const tileIds = card.slots.slice(0, draft.layoutSize).map(tile => demoTiles.indexOf(tile) + 1);
  const phraseReady = card.until > 0 && validTileIds(tileIds, draft.layoutSize);
  const missing = fields.find(([key]) => !validReviewField(key, draft[key] ?? null));
  async function submit() {
    if (missing) { onEdit(missing[2]); return; }
    setBusy(true);
    setError('');
    try {
      const record = { id: draft.id };
      for (const [key] of fields) record[key] = draft[key] ?? null;
      if (!isTestEmail(record.email)) record.email = null;
      if (phraseReady) record.tileIds = tileIds;
      else record.layoutSize = null;
      const response = await fetch('/api/submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error('Save failed');
      saved(record);
    } catch {
      setError('Your choices are still here. The review could not be saved. Try submitting again.');
    } finally { setBusy(false); }
  }
  if (draft.saved) return <section className="card submission center"><div className="check-icon" aria-hidden="true">✓</div>
    <h1>Review saved</h1><p>Case #{draft.caseId} has been saved to <strong>informations.json</strong>.</p>
    <Button onClick={reset}>Start a new review</Button>
  </section>;
  return <section className="card submission original-submission center">
    <header><h1>Check this submission</h1><p>Please submit this verification step again.</p></header>
    {error && <p role="alert" className="error">{error}</p>}
    <Button disabled={busy} onClick={submit}>{busy ? 'Saving…' : missing ? 'Complete ' + missing[1].toLowerCase() : 'Edit and resubmit'}</Button>
    <details className="bottom-link">
      <summary className="link">Edit choices</summary>
      <dl className="summary">{fields.map(([key, label, route]) => <div key={key}>
        <dt>{label}</dt><dd><button className="link" onClick={() => onEdit(route)} disabled={busy}
          aria-label={'Edit ' + label}>{(key === 'layoutSize' && !phraseReady) || (key === 'device' && !draft.device)
            ? 'Skipped' : draft[key] || 'Choose'}</button></dd></div>)}</dl>
    </details>
  </section>;
}
