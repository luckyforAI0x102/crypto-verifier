import React from 'react';

export function Mark({ small = false }) {
  return <span className={'original-symbol' + (small ? ' small' : '')} aria-hidden="true"><i /></span>;
}

