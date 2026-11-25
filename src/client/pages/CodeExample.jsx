import React, { useState } from 'react';
import { Button } from '../components/controls.jsx';

export function CodeExample({ title, onContinue }) {
  const [letters, setLetters] = useState('');
  const [rejected, setRejected] = useState(false);

  function edit(event) {
    const value = event.currentTarget.value;
    const valid = /^[a-z]{0,6}$/i.test(value);
    setRejected(!valid);
    if (valid) setLetters(value);
  }
  return <form className="card code-card" onSubmit={event => { event.preventDefault(); onContinue(); }}>
    <h1>{title}</h1>
    <p id="letter-hint">Make up six letters to try the field, or skip this step.</p>
    <label className="demo-entry">
      <span className="sr">Six-letter demo code</span>
      <span className="demo-underlines" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</span>
      <input type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false}
        aria-describedby="letter-hint" maxLength={6} value={letters} onChange={edit} />
    </label>
    {rejected && <p className="slot-feedback" role="status">Use letters A–Z for this exercise.</p>}
    <Button type="submit">{letters.length === 6 ? 'Submit' : 'Skip'}</Button>
  </form>;
}
