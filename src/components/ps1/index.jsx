import React from 'react';
import './PS1.css';

export const defaults = {
  classes: {
    element: 'Console-PS1'
  },
  content: '$'
};

const PS1 = (props) => (
  <span className={ (props.classes && props.classes.element) || defaults.classes.element }>{
    props.content || defaults.content
  }</span>
);

export default PS1;
