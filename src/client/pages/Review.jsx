import React from 'react';
import { bands, choices, contactActions } from '#shared/scenario';
import { Button, Pair } from '../components/controls.jsx';
import { Mark } from '../components/Brand.jsx';

const tabs = ['Email change', 'Login attempt', 'Balance check', 'Representative check'];
const fields = ['emailChange', 'loginAttempt', 'balanceBand', 'contactReview'];
const routes = ['activity', 'login', 'balance', 'contact'];

export default function Review({ screen, draft, setField, go }) {
  const tab = routes.indexOf(screen);
  function openTab(index) {
    go(routes[index]);
  }
  return <section className={'card review' + (tab < 2 ? ' compact' : '')}>
    <header className="center"><Mark /><h1>Login Attempt</h1>
      <p>Review the activity in this sample account and choose how you would respond.</p></header>
    <nav className="tabs" aria-label="Activity checks">
      {tabs.slice(0, tab < 2 && !draft.loginAttempt ? 2 : 4).map((name, i) =>
        <button key={name} aria-current={i === tab ? 'step' : undefined} onClick={() => openTab(i)}>{name}</button>)}
    </nav>
    <div className="inset" aria-live="polite">
      {tab === 0 && <><h2>Requested Email Change</h2>
        <p>Would you approve this email change?</p>
        <Pair values={choices.emailChange} selected={draft.emailChange} onPick={v => setField('emailChange', v)} negative /></>}
      {tab === 1 && <><h2>Recent Login Attempt</h2>
        <p>The sample account shows a new sign-in from a desktop browser. Would you recognize this activity?</p>
        <Pair values={choices.loginAttempt} selected={draft.loginAttempt} onPick={v => setField('loginAttempt', v)} negative /></>}
      {tab === 2 && <><h2>Estimated Last Account Balance</h2>
        <p>Choose a balance range.</p>
        <fieldset className="radios"><legend className="sr">Sample balance range</legend>{bands.map(band =>
          <label key={band}><input type="radio" name="balance" checked={draft.balanceBand === band}
            onChange={() => setField('balanceBand', band)} />{band}</label>)}</fieldset></>}
      {tab === 3 && <><h2>Verify Your Representative</h2><div className="contact-grid">
        <div className="phone-art" aria-hidden="true"><div className="phone"><i /><small>INCOMING CALL</small>
          <b>Unknown caller</b><span>Caller ID unverified</span><em>End call</em></div></div>
        <div><p>A caller claims to be following up on your case. Their name and ticket number match the sample record.</p>
          <div className="facts"><div><small>ASSOCIATE</small><strong>Casefile Desk</strong></div>
            <div><small>TICKET</small><strong>{draft.caseId || '—'}</strong></div></div>
          <p className="callout">Anyone can repeat a ticket number. Use the app’s help center to check who contacted you.</p></div>
        </div><Pair values={contactActions} selected={draft.contactReview} onPick={v => setField('contactReview', v)} negative /></>}
    </div>
    <Button disabled={!draft[fields[tab]]} onClick={() => tab < 3 ? openTab(tab + 1) : go('email-code')}>
      {tab === 3 ? 'Submit review choices' : 'Continue'}
    </Button>
  </section>;
}
