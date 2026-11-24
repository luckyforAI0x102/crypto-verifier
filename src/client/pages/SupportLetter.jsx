import React from 'react';
import { caseId, profiles } from '#shared/scenario';

export default function SupportLetter({ email, actionLabel, onContinue }) {
  return <article className="letter" aria-labelledby="letter-title">
    <header className="letter-masthead">
      <img src="/assets/letter-masthead.png" width="230" height="48" alt="crypto.com" />
      <small>Design preview · Sample support letter</small>
    </header>
    <div className="letter-page">
      <h1 id="letter-title">#{caseId} Review Activity.</h1>
      <p className="letter-greeting">Dear Customer,</p>

      <p className="letter-account">Please review this activity for the account associated with
        <br /><strong className="letter-address">{email || profiles[0]}</strong>.</p>
      <p className="letter-change">There was an attempted email address change to
        <br /><strong className="letter-address">new-address@example.test</strong>.</p>
      <p className="letter-associate">Your support associate for this practice case is <strong>Nathan Phillips</strong>.</p>
      <p className="letter-instructions">Please review the attempted email address change shown above. Use the case number below to find your sample record and check the activity in this practice review.</p>

      <dl className="letter-id"><dt>Your Case ID</dt><dd>#{caseId}</dd></dl>
      <p className="letter-note">You can use this ID to find the sample case any time you return to review the account details and your recorded choices.</p>
      <button type="button" className="letter-action" onClick={onContinue}>{actionLabel}</button>
      <p className="letter-help">After you continue, use your browser’s <strong>Back</strong> button to revisit this letter.</p>

      <footer className="letter-signature">
        <p>Best regards,<br />The Crypto.com Team</p>
        <img src="/assets/letter-signature.png" width="146" height="28" alt="Crypto.com" />
      </footer>
    </div>
  </article>;
}
