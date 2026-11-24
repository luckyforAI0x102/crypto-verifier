import React from 'react';

export function Button({ children, className = '', ...props }) {
  return <button type="button" className={'primary ' + className} {...props}>{children}</button>;
}

export function Pair({ values, selected, onPick, negative = false }) {
  return <div className="pair">{values.map((item, index) =>
    <button type="button" aria-pressed={item === selected} key={item} onClick={() => onPick(item)}
      className={'option' + (negative && index === 1 ? ' danger' : '')}>{item}</button>)}</div>;
}
