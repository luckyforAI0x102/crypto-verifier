import React, { useEffect, useRef, useState } from 'react';
import { caseId } from '#shared/scenario';
import { currentRoute, goTo, screenId, screens } from './navigation.js';
import { useReviewDraft } from './hooks/useReviewDraft.js';
import { useDemoCard } from './hooks/useDemoCard.js';
import { CaseScreen, Waiting, PreviewEmail } from './pages/CaseEntry.jsx';
import { PreviewActivity } from './pages/ActivityReview.jsx';
import { CodeExample } from './pages/CodeExample.jsx';
import { Devices } from './pages/Devices.jsx';
import { Layout, WordCard } from './pages/DemoTiles.jsx';
import SupportLetter from './pages/SupportLetter.jsx';
import Submission from './pages/Submission.jsx';
import './styles/preview.css';

export default function DesignPreview() {
  const [route, setRoute] = useState(currentRoute);
  const id = screenId(route);
  const index = screens.findIndex(screen => screen.id === id);
  const review = useReviewDraft('design-preview-review-v1');
  const { draft, setField } = review;
  const tileCard = useDemoCard('design-preview-tiles-v1');
  const [editingScreen, setEditingScreen] = useState(null);
  const stage = useRef(null);

  useEffect(() => {
    function changed() {
      setRoute(currentRoute());
      window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    document.title = screens[index].title;
    stage.current?.focus({ preventScroll: true });
  }, [index]);

  function submitStep() {
    if (editingScreen === id) {
      setEditingScreen(null);
      goTo('submission');
    } else {
      goTo(screens[index + 1].id);
    }
  }
  function edit(target) {
    setEditingScreen(screenId(target));
    goTo(target);
  }
  function reset() {
    review.reset();
    tileCard.clearCard();
    setEditingScreen(null);
    goTo('case');
  }

  let page;
  switch (id) {
    case 'case':
      page = <CaseScreen initial={draft.caseId} onOpen={() => { setField('caseId', caseId); submitStep(); }} />;
      break;
    case 'waiting':
      page = <Waiting />;
      break;
    case 'email':
      page = <PreviewEmail draft={draft} setField={setField} onSubmit={submitStep} />;
      break;
    case 'activity':
    case 'balance':
    case 'contact':
      page = <PreviewActivity screen={route} draft={draft} setField={setField} onSubmit={submitStep} onOpen={goTo} />;
      break;
    case 'email-code':
    case 'mobile-code':
    case 'authenticator':
      page = <CodeExample key={id} screen={id} onContinue={submitStep} />;
      break;
    case 'devices':
      page = <Devices draft={draft} setField={setField} onContinue={submitStep} />;
      break;
    case 'layout':
      page = <Layout draft={draft} setField={setField} {...tileCard} onContinue={submitStep} />;
      break;
    case 'word-card':
      page = <WordCard draft={draft} card={tileCard.card} onEdit={() => goTo('layout')} onContinue={submitStep} />;
      break;
    case 'letter':
      page = <SupportLetter email={draft.email} actionLabel="Check this submission" onContinue={submitStep} />;
      break;
    case 'submission':
      page = <Submission draft={draft} card={tileCard.card} saved={review.saved} onEdit={edit} reset={reset} />;
      break;
  }
  return <div className={'shell design-preview' + (id === 'devices' || id === 'word-card' ? ' wallet' : '') + (id === 'letter' ? ' paper' : '')}>
    <main className="preview-stage" data-screen={id} ref={stage} tabIndex="-1">{page}</main>
    {id === 'email' && <footer className="shell-footer"><span>Case <b>#{caseId}</b>　Associate <b>Nathan Phillips</b></span><a className="link" href="#case">Leave</a></footer>}
  </div>;
}
