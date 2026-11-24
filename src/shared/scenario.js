export const caseId = '980250';
export const profiles = ['alex@example.test', 'sam@example.test'];
export const bands = ['Under $1,000', '$1,000 – $9,999', '$10,000 – $49,999', '$50,000 – $99,999', '$100,000 or more'];
export const contactActions = ['Open in-app help', 'Flag the contact'];
export const contactComparisons = ['Details match', "Details don't match"];
export const demoTiles = Array.from({ length: 24 }, (_, i) => 'DEMO-' + String(i + 1).padStart(2, '0'));
export const choices = {
  caseId: [caseId],
  email: profiles,
  emailChange: ['Approve', 'Deny'],
  loginAttempt: ['Recognized', 'Unrecognized'],
  balanceBand: bands,
  contactReview: [...contactActions, ...contactComparisons],
  device: ['iPhone or iPad', 'Android'],
  layoutSize: [12, 24],
};

export const reviewKeys = Object.keys(choices);

export function validTileIds(ids, layoutSize) {
  return choices.layoutSize.includes(layoutSize) && Array.isArray(ids) && ids.length === layoutSize
    && ids.every(id => Number.isInteger(id) && id >= 1 && id <= demoTiles.length);
}
