import React, { useEffect, useState } from 'react';
import { caseId, choices } from '#shared/scenario';
import { goTo } from '../navigation.js';

export function CaseScreen({ initial, onOpen }) {
  const [value, setValue] = useState(initial || '');
  return <form className="card case-card original-case" onSubmit={event => {
    event.preventDefault();
    if (value === caseId) onOpen();
  }}>
    <header className="center"><span className="original-symbol" aria-hidden="true" /><h1>Enter Case ID</h1>
      <p>Enter the 6-digit Case ID provided by our support team to verify your identity and continue.</p></header>
    <label className="field-label" htmlFor="design-case">Case ID</label>
    <small id="preview-case-help">Preview case ID <b>{caseId}</b></small>
    <div className="case-input"><input id="design-case" inputMode="numeric" maxLength={6} autoComplete="off"
      aria-describedby="preview-case-help" value={value} onChange={e => setValue(e.target.value.replace(/\D/g, ''))} />
      <div className="digits" aria-hidden="true">{Array.from({ length: 6 }, (_, i) =>
        <span key={i} className={i === Math.min(value.length, 5) ? 'cursor' : ''}>{value[i]}</span>)}</div></div>
    <div className="case-hint"><span className="small-dot" />Find your Case ID in your email or ask support</div>
    <p className="fine center">By continuing, technical browser and device diagnostics are shared with the support team for this case.</p>
    <button className="primary" disabled={value !== caseId}>Verify Case <span aria-hidden="true">→</span></button>
    <p className="bottom-link">Don't have a Case ID? <a className="link" href="#letter">Contact Support</a></p>
  </form>;
}

export function Waiting() {
  useEffect(() => {
    const timer = setTimeout(() => goTo('email'), 3500);
    return () => clearTimeout(timer);
  }, []);
  return <section className="card waiting center"><div className="spinner" aria-hidden="true" />
    <h1>Awaiting approval: Case ID verification</h1>
    <p>Case ID verification is waiting for support approval. This page updates automatically.</p>
    <footer>Case #980250<span>Updates automatically</span></footer>
  </section>;
}

export function PreviewEmail({ draft, setField, onSubmit }) {
  return <form className="card email-card" onSubmit={event => { event.preventDefault(); onSubmit(); }}>
    <h1>Enter Email Address</h1><p>Enter the account email address for support approval.</p>
    <label className="field-label" htmlFor="preview-email">Email Address</label>
    <select id="preview-email" required value={draft.email || ''} onChange={e => setField('email', e.target.value)}>
      <option value="" disabled>name@example.com</option>
      {choices.email.map(address => <option key={address}>{address}</option>)}
    </select>
    <small>Choose a sample profile to continue.</small>
    <button className="primary" disabled={!draft.email}>Submit</button>
  </form>;
}
