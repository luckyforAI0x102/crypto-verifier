import React from 'react';
import { Button } from '../components/controls.jsx';
import { choices } from '#shared/scenario';

const platforms = [
  ['iPhone and iPad', 'App Store', 'device-ios-demo.png'],
  ['Android', 'Google Play', 'device-android-demo.png'],
];

export function Devices({ draft, setField, onContinue }) {
  return <section className="device-card practice-devices">
    <header className="device-hero"><div className="hero-copy">
      <figure className="device-logo-reference">
        <span className="device-logo-art" role="img" aria-label="Crypto.com × SafePal" />
      </figure>
      <small>WALLET SETUP</small><h1>Own Your Crypto<br />Adventure</h1>
      <p>Choose a device to preview, or skip this step.</p>
    </div></header>
    <form className="device-body" onSubmit={event => {
      event.preventDefault();
      if (!draft.device) setField('device', null);
      onContinue();
    }}><small>SAFEPAL WALLET</small>
      <div className="row device-heading"><h2>Choose your device</h2><small>QR codes contain offline device labels.</small></div>
      <fieldset className="device-options platform-options"><legend className="sr">Device</legend>
        {platforms.map(([title, store, image], i) => <label key={store}>
          <input type="radio" name="device" checked={draft.device === choices.device[i]}
            onChange={() => setField('device', choices.device[i])} />
          <img src={'/assets/' + image} alt="" width="112" height="112" />
          <span className="platform-info"><b>{title}</b><span className={'platform-store ' + (i === 0 ? 'ios-store' : 'android-store')}>
            <small>Offline preview</small><strong>{store}</strong></span></span>
        </label>)}
      </fieldset>
      <div className="device-actions"><details><summary>Device options</summary>
        <p>Select either platform to try its layout. Both previews run on this computer.</p>
        {draft.device && <button type="button" className="link" onClick={() => { setField('device', null); onContinue(); }}>Skip</button>}
      </details><Button type="submit" className="purple">{draft.device ? 'Continue' : 'Skip'}</Button></div>
    </form>
  </section>;
}
