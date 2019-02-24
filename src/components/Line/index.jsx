import React from 'react';
import PS1 from '../PS1';
import Cursor from '../Cursor';

export const defaults = {
  classes: {
    element: 'Console-Line',
    content: 'Console-Line-content'
  }
};

const Line = (props) => {
  const classes = Object.assign({}, defaults.classes, props.classes);
  return (
    <pre className={ classes.element }>{
      props.ps1 && (
        <PS1 { ...props.ps1 } />
      )
    }<span className={ classes.content }>{
      props.content
    }</span>{
      props.write && (
        <Cursor { ...props.cursor } />
      )
    }</pre>
  );
};

export default Line;
