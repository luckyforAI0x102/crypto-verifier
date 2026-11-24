import React, { useState } from 'react';
import { Button } from '../components/controls.jsx';

const examples = {
  'email-code': ['Verify Email Address', 'POSTAL', 'the sample email'],
  'mobile-code': ['Verify Mobile Number', 'MOBILE', 'the sample mobile message'],
  authenticator: ['Two-Factor Authentication', 'PUZZLE', 'the sample authenticator'],
};

export function CodeExample({ screen, onContinue }) {
  const [title, example, source] = examples[screen];
  const [letters, setLetters] = useState('');
  const [rejected, setRejected] = useState(false);
  const complete = letters.toUpperCase() === example;

  function edit(event) {
    const value = event.currentTarget.value;
    // An ordered subset lets the user delete or replace text anywhere in the example.
    let from = 0;
    for (const letter of value) {
      const index = example.indexOf(letter.toUpperCase(), from);
      if (index < 0 || !/^[a-z]$/i.test(letter)) {
        setRejected(true);
        return;
      }
      from = index + 1;
    }
    setRejected(false);
    setLetters(value);
  }
  return <form className="card code-card" onSubmit={event => { event.preventDefault(); if (complete) onContinue(); }}>
    <h1>{title}</h1>
    <p id="letter-hint">Enter the demo code from {source} (<strong className="demo-token">{example}</strong>).</p>
    <label className="demo-entry">
      <span className="sr">Six-letter demo code</span>
      <span className="demo-underlines" aria-hidden="true">{Array.from(example, (_, i) => <i key={i} />)}</span>
      <input type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false}
        aria-describedby="letter-hint" maxLength={example.length} value={letters} onChange={edit} />
    </label>
    {rejected && <p className="slot-feedback" role="status">Type the displayed example, {example}.</p>}
    <Button type="submit" disabled={!complete}>Submit</Button>
  </form>;
}
