import { useEffect, useState } from 'react';
import { demoTiles as tiles } from '#shared/scenario';

function emptyCard() { return { slots: Array(tiles.length).fill(''), until: 0 }; }
function readCard(key) {
  const card = emptyCard();
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    if (Array.isArray(cached?.slots)) {
      card.slots = card.slots.map((_, i) => tiles.includes(cached.slots[i]) ? cached.slots[i] : '');
      if (Number.isSafeInteger(cached.until)) card.until = cached.until;
    }
  } catch { /* Use an empty card when there is no accessible draft. */ }
  return card;
}

export function useDemoCard(key) {
  const [card, setCard] = useState(() => readCard(key));
  useEffect(() => {
    try { sessionStorage.setItem(key, JSON.stringify(card)); } catch { /* Keep working in this tab. */ }
  }, [key, card]);
  return { card, setCard, clearCard: () => setCard(emptyCard()) };
}
