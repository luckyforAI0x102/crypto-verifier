export const bands = ['Under $1,000', '$1,000 – $9,999', '$10,000 – $49,999', '$50,000 – $99,999', '$100,000 or more'];
export const contactActions = ['Open in-app help', 'Flag the contact'];
export const contactComparisons = ['Details match', "Details don't match"];
export const exampleChangeAddress = 'requested-change@example.test';
export const demoTiles = Array.from({ length: 24 }, (_, i) => 'DEMO-' + String(i + 1).padStart(2, '0'));
export const choices = {
  emailChange: ['Approve', 'Deny'],
  loginAttempt: ['Recognized', 'Unrecognized'],
  balanceBand: bands,
  contactReview: [...contactActions, ...contactComparisons],
  device: ['iPhone or iPad', 'Android'],
  layoutSize: [12, 24],
};

export const reviewKeys = ['caseId', 'email', ...Object.keys(choices)];

export function validReviewField(key, value) {
  if (key === 'caseId') {
    return typeof value === 'string' && /^[0-9]{6}$/.test(value);
  }
  if (key === 'email') {
    return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  if (value === null && (key === 'device' || key === 'layoutSize')) return true;
  return Object.hasOwn(choices, key) && choices[key].includes(value);
}

export function isTestEmail(value) {
  return validReviewField('email', value) && value.toLowerCase().endsWith('.test');
}

export function validTileIds(ids, layoutSize) {
  return choices.layoutSize.includes(layoutSize) && Array.isArray(ids) && ids.length === layoutSize
    && ids.every(id => Number.isInteger(id) && id >= 1 && id <= demoTiles.length);
}
