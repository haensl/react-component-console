import React from 'react';
import './cursor.css';

export const DEFAULTS = {
  classes: {
    blink: 'console-cursor--blink',
    element: 'console-cursor',
    write: 'console-cursor--write'
  },
  intervalMs: 400
};

class Cursor extends React.Component {
  constructor() {
    super();
    this.state = {
      blink: false,
      blinkInterval: null
    };
  }

  blink(interval) {
    this.setState({
      blinkInterval: setInterval((() => {
        this.setState({
          blink: !this.state.blink
        });
      }).bind(this), interval)
    });
  }

  stopBlinking() {
    if (this.state.blinkInterval) {
      clearInterval(this.state.blinkInterval);
    }

    this.setState({
      blink: false,
      blinkInterval: null
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.char) {
      this.stopBlinking();
    } else if (this.state.blinkInterval === null) {
      this.blink(nextProps.intervalMs || DEFAULTS.intervalMs);
    }
  }

  componentDidMount() {
    this.blink(this.props.intervalMs || DEFAULTS.intervalMs);
  }

  componentWillUnmount() {
    this.stopBlinking();
  }

  render() {
    const classes = Object.assign({}, DEFAULTS.classes, this.props.classes);
    let classesString = classes.element;
    if (this.props.char) {
      classesString = `${classesString} ${classes.write}`;
    } else if (this.state.blink) {
      classesString = `${classesString} ${classes.blink}`;
    }

    return (
      <span class={ classesString }>{
        this.props.char
      }</span>
    );
  }
}

export default Cursor;
