import React, { useEffect, useState } from 'react';
import { Button } from '../components/controls.jsx';
import { choices, demoTiles as tiles } from '#shared/scenario';

const windowLength = 30 * 60 * 1000;

export function Layout({ draft, setField, card, setCard, onContinue }) {
  const count = draft.layoutSize || 12;
  const slots = card.slots.slice(0, count);
  const filled = slots.filter(Boolean).length;
  function changeSize(size) {
    if (size !== count) setCard(old => ({ ...old, until: 0 }));
    setField('layoutSize', size);
  }
  function changeTile(position, value) {
    if (value && !tiles.includes(value)) return;
    setCard(old => ({ slots: old.slots.map((tile, i) => i === position ? value : tile), until: 0 }));
  }
  function fillEmpty() {
    setCard(old => ({ slots: old.slots.map((tile, i) => i < count && !tile ? tiles[i] : tile), until: 0 }));
  }
  function submit(event) {
    event.preventDefault();
    if (filled !== count) return;
    setField('layoutSize', count);
    setCard(old => ({ ...old, until: Date.now() + windowLength }));
    onContinue();
  }
  return <form className="card layout-card practice-layout" onSubmit={submit}>
    <header className="center"><span className="original-symbol" aria-hidden="true" /><p className="eyebrow">CRYPTO.COM</p><h1>Build your practice<br />phrase card</h1></header>
    <div className="row"><b>Phrase length</b><small>Select 12 or 24 tiles</small></div>
    <div className="pair">{choices.layoutSize.map(size => <button type="button" className="option" key={size}
      aria-pressed={size === count} onClick={() => changeSize(size)}>{size} <small>tiles</small></button>)}</div>
    <div className="row"><b>Practice tiles</b><button className="link" type="button" disabled={filled === count} onClick={fillEmpty}>Fill empty slots</button></div>
    <ol className="tile-grid editable-tiles">{slots.map((value, i) => <li key={i}>
      <label><span aria-hidden="true">{i + 1}</span><select value={value} aria-label={'Tile ' + (i + 1)}
        onChange={event => changeTile(i, event.target.value)}>
        <option value="" aria-label="Choose a demo tile"></option>{tiles.map(tile => <option key={tile}>{tile}</option>)}
      </select></label>
    </li>)}</ol>
    <div className="layout-footer"><small role="status">{filled} of {count} tiles entered</small>
      <Button type="submit" disabled={filled !== count}>Submit</Button></div>
    <p className="note">Choose the demo labels in the order you want them to appear on your card.</p>
  </form>;
}

export function WordCard({ draft, card, onEdit, onContinue }) {
  const count = draft.layoutSize || 12;
  const slots = card.slots.slice(0, count);
  const [now, setNow] = useState(Date.now);
  const [copyStatus, setCopyStatus] = useState('');
  const remaining = Math.max(0, Math.ceil((card.until - now) / 1000));
  const published = card.until > 0 && slots.every(Boolean);
  const running = published && remaining > 0;
  const example = !published && slots.every(tile => !tile);
  const displayTiles = example ? tiles.slice(0, count) : slots;
  useEffect(() => {
    if (!running) return;
    const update = () => setNow(Date.now());
    const timer = setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, [running]);
  async function copy() {
    if (!example && (!running || Date.now() >= card.until)) return;
    try {
      await navigator.clipboard.writeText(displayTiles.join(' '));
      setCopyStatus('copied');
    } catch { setCopyStatus('manual'); }
  }
  const time = Math.floor(remaining / 60) + ':' + String(remaining % 60).padStart(2, '0');
  return <section className="vault-card practice-vault">
    <figure className="vault-logo-reference">
      <span className="vault-logo-art" role="img" aria-label="Crypto.com × SafePal" />
    </figure>
    <header className="center"><h1>Your practice phrase card</h1>
      <p>Keep the tiles in the numbered order shown below. This display closes automatically when its 30-minute window ends.</p>
    </header>
    <div className="vault-meta"><span>{count}-tile card</span>
      <b>{running ? time + ' remaining' : published ? 'Preview window ended' : example ? 'Example' : 'Draft'}</b></div>
    <div className="vault-inset">
      {published && !running ? <p>The 30-minute preview has ended.</p> : <>
        <ol className="tile-grid filled">{displayTiles.map((tile, i) => <li key={i}><span>{i + 1}</span>{tile || '—'}</li>)}</ol>
        <Button className="purple" disabled={!running && !example} onClick={copy}>Copy demo tiles</Button>
        {copyStatus === 'copied' && <p className="copy-status" role="status">Copied</p>}
        {copyStatus === 'manual' && <div className="copy-status" role="status">
          <p>Select this line to copy the demo labels manually.</p><code className="copy-line">{displayTiles.join(' ')}</code>
        </div>}</>}
    </div>
    <p className="card-caption">Copy the demo card in one click, with every tile kept in order.</p>
    <div className="note violet vault-actions"><strong>Offline practice card</strong>
      <div className="card-actions"><button type="button" className="link" onClick={onEdit}>Edit tiles</button>
        <Button className="purple" disabled={!published} onClick={onContinue}>Continue</Button></div></div>
  </section>;
}
