import React from 'react';
import { caseId, choices, contactComparisons } from '#shared/scenario';
import { Pair } from '../components/controls.jsx';

function RepresentativePanel({ draft, setField }) {
  return <>
    <h2>Verify Your Representative</h2>
    <div className="contact-grid">
      <img className="representative-warning-image" src="/assets/representative-warning.png" width="240" height="240"
        alt="Phone displaying an in-app warning that Crypto.com is not calling." />
      <div>
        <p>Practice case <strong>#{caseId}</strong> · Compare the two sample records.</p>
        <p>In this example, the caller gives the name <strong>Nathan Phillips</strong> and ticket <strong>{caseId}</strong>.</p>
        <p>The phone shows an impersonation warning. The sample caller ID is <span className="example-number">+1 202 555 0148</span>. A caller can spoof the number on your screen.</p>
        <p>Compare the name and ticket with the sample record below. To check who contacted you, open support from inside the app.</p>
        <dl className="facts representative-facts">
          <div><dt>AGENT</dt><dd>Nathan Phillips</dd></div>
          <div><dt>TICKET</dt><dd>{caseId}</dd></div>
        </dl>
        <p className="callout">If any details don’t match, end the call immediately.</p>
      </div>
    </div>
    <Pair values={contactComparisons} selected={draft.contactReview}
      onPick={value => setField('contactReview', value)} negative />
  </>;
}

const activityTabs = [
  ['activity', 'Email change'], ['login', 'Login attempt'],
  ['balance', 'Balance check'], ['contact', 'Representative check'],
];

export function PreviewActivity({ screen, draft, setField, onSubmit, onOpen }) {
  const balance = screen === 'balance';
  const contact = screen === 'contact';
  const login = screen === 'login';
  const compact = !balance && !contact;
  const choice = login ? 'loginAttempt' : 'emailChange';
  const complete = contact ? contactComparisons.includes(draft.contactReview) : Boolean(draft[balance ? 'balanceBand' : choice]);
  function submit(event) {
    event.preventDefault();
    if (!complete) return;
    if (compact && (!draft.emailChange || !draft.loginAttempt)) onOpen(draft.emailChange ? 'login' : 'activity');
    else onSubmit();
  }
  return <form className={'card review' + (compact ? ' compact' : '') + (contact ? ' representative-review' : '')} onSubmit={submit}>
    <header className="center"><span className="original-symbol" aria-hidden="true" /><h1>Login Attempt</h1>
      <p>We detected unusual activity on your account. Please review each action to secure your account.</p></header>
    <nav className="tabs" aria-label="Activity checks">{activityTabs.slice(0, compact ? 2 : 4).map(([route, label]) =>
      <button key={route} type="button" aria-current={route === screen ? 'step' : undefined}
        onClick={() => onOpen(route)}>{label}</button>)}</nav>
    <section className="inset">
      {contact && <RepresentativePanel draft={draft} setField={setField} />}
      {balance && <><h2>Estimated Last Account Balance</h2>
        <p>Select the range that most closely matches the last estimated balance shown on your account.</p>
        <small>Use the sample statement balance of <strong>$4,250</strong> for this step.</small>
        <fieldset className="radios"><legend className="sr">Balance check for the sample statement</legend>
          {choices.balanceBand.map(band => <label key={band}><input name="balanceBand" type="radio" required
            checked={draft.balanceBand === band} onChange={() => setField('balanceBand', band)} />{band}</label>)}</fieldset></>}
      {compact && <><h2>{login ? 'Login attempt' : 'Requested Email Change'}</h2>
          <small>Activity review for sample account <strong>{draft.email || choices.email[0]}</strong></small>
          {!login && <p>A request was made to change the account email to <strong>mohammed41@gmail.com</strong>.</p>}
          <Pair values={choices[choice]} selected={draft[choice]} onPick={value => setField(choice, value)} negative /></>}
    </section>
    <button className="primary" disabled={!complete}>Submit</button>
  </form>;
}
