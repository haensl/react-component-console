import React from 'react';
import './PS1.css';
import _defaults from './defaults';

export const defaults = _defaults;

const PS1 = ({
  classes = defaults.classes,
  content = defaults.content
}) => (
  <span className={ (classes && classes.element) || defaults.classes.element }>{
    content || defaults.content
  }</span>
);

export default PS1;
