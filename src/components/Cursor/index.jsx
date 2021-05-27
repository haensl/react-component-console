import React, { useEffect, useMemo, useState } from 'react';
import _defaults from './defaults';
import './Cursor.css';

export const defaults = _defaults;

const Cursor = ({
  char,
  classes = defaults.classes,
  intervalMs = defaults.intervalMs
}) => {
  const [blinkInterval, setBlinkInterval] = useState(null);
  const [renderBlink, setRenderBlink] = useState(false);

  const isBlinking = useMemo(
    () => !!blinkInterval,
    [ blinkInterval]
  );

  const blink = useMemo(() => () => {
    if (isBlinking) {
      return;
    }

    setBlinkInterval(
      setInterval(() => {
        setRenderBlink(!renderBlink);
      }, intervalMs)
    );
  }, [
    intervalMs,
    isBlinking,
    renderBlink
  ]);

  const stopBlinking = useMemo(() => () => {
    if (blinkInterval) {
      clearInterval(blinkInterval);
      setBlinkInterval(null);
    }
  }, [blinkInterval]);

  useEffect(() => {
    if (typeof char === 'string' && char.length) {
      stopBlinking();
    } else {
      blink();
      return stopBlinking;
    }
  }, [blink, char, stopBlinking]);

  const classesString = useMemo(() => {
    const joinedClasses = {
      ...defaults.classes,
      ...classes
    };

    if (char) {
      return `${joinedClasses.element} ${joinedClasses.write}`;
    } else if (renderBlink) {
      return `${joinedClasses.element} ${joinedClasses.blink}`;
    }

    return classes.element;
  }, [char, classes, renderBlink]);

  return (
    <span className={ classesString }>{
      char || ' '
    }</span>
  );
};

export default Cursor;
