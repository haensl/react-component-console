import React, { useMemo } from 'react';
import PS1 from '../PS1';
import Cursor from '../Cursor';
import _defaults from './defaults';

export const defaults = _defaults;

const Line = ({
  classes = defaults.classes,
  content,
  cursor,
  ps1,
  write
}) => {
  const joinedClasses = useMemo(() => ({
    ...defaults.classes,
    ...classes
  }), [classes]);

  return (
    <pre className={ joinedClasses.element }>{
      ps1 && (
        <PS1 { ...ps1 } />
      )
    }<span className={ joinedClasses.content }>{
      content
    }</span>{
      write && (
        <Cursor { ...cursor } />
      )
    }</pre>
  );
};

export default Line;
