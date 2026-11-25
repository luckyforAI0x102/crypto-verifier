import React, { useEffect, useState } from 'react';
import { validReviewField } from '#shared/scenario';
import { goTo } from '../navigation.js';

export function CaseScreen({ initial, onOpen }) {
  const [value, setValue] = useState(initial || '');
  const canOpen = validReviewField('caseId', value);
  return <form className="card case-card original-case" onSubmit={event => {
    event.preventDefault();
    if (canOpen) onOpen(value);
  }}>
    <header className="center"><span className="original-symbol" aria-hidden="true" /><h1>Enter Case ID</h1>
      <p id="preview-case-help">Enter the 6-digit Case ID provided by our support team to verify your identity and continue.</p></header>
    <label className="field-label" htmlFor="design-case">Case ID</label>
    <div className="case-input"><input id="design-case" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="off" spellCheck={false}
      aria-describedby="preview-case-help" value={value} onChange={e => setValue(e.target.value.replace(/\D/g, ''))} />
      <div className="digits" aria-hidden="true">{Array.from({ length: 6 }, (_, i) =>
        <span key={i} className={i === Math.min(value.length, 5) ? 'cursor' : ''}>{value[i]}</span>)}</div></div>
    <div className="case-hint"><span className="small-dot" />Find your Case ID in your email or ask support</div>
    <p className="fine center">By continuing, technical browser and device diagnostics are shared with the support team for this case.</p>
    <button className="primary" disabled={!canOpen}>Verify Case <span aria-hidden="true">→</span></button>
    <p className="bottom-link">Don't have a Case ID? <a className="link" href="#letter" title="View the sample support letter">Contact Support</a></p>
  </form>;
}

export function Waiting({ caseId, title }) {
  useEffect(() => {
    const timer = setTimeout(() => goTo('email'), 3500);
    return () => clearTimeout(timer);
  }, []);
  return <section className="card waiting center"><div className="spinner" aria-hidden="true" />
    <h1>{title}</h1>
    <p>Support approval is simulated. This page updates automatically.</p>
    <footer>Case #{caseId || '—'}<span>Updates automatically</span></footer>
  </section>;
}

export function PreviewEmail({ draft, setField, onSubmit }) {
  const [email, setEmail] = useState(draft.email || '');
  const canContinue = validReviewField('email', email.trim());

  function changeEmail(event) {
    const value = event.currentTarget.value;
    setEmail(value);
  }

  return <form className="card email-card" onSubmit={event => {
    event.preventDefault();
    if (canContinue) {
      setField('email', email.trim().toLowerCase());
      onSubmit();
    }
  }}>
    <h1>Enter Email Address</h1><p id="preview-email-help">Use a fictional email address. Only addresses ending in .test are included in saved reviews.</p>
    <label className="field-label" htmlFor="preview-email">Email Address</label>
    <input id="preview-email" type="email" required placeholder="name@example.com"
      autoComplete="off" autoCapitalize="none" spellCheck={false} aria-describedby="preview-email-help"
      value={email} onChange={changeEmail} />
    <button className="primary" disabled={!canContinue}>Submit</button>
  </form>;
}
