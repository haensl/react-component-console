import React from 'react';
import './Cursor.css';

export const defaults = {
  classes: {
    blink: 'Console-Cursor--blink',
    element: 'Console-Cursor',
    write: 'Console-Cursor--write'
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

  get isBlinking() {
    return !!this.state.blinkInteval;
  }

  blink(interval) {
    if (this.isBlinking) {
      return this.stopBlinking(this.blink.bind(this));
    }

    this.setState({
      blinkInterval: setInterval((() => {
        this.setState({
          blink: !this.state.blink
        });
      }), interval)
    });
  }

  stopBlinking(callback) {
    if (this.state.blinkInterval) {
      clearInterval(this.state.blinkInterval);
    }

    if (this.state.blink) {
      this.setState({
        blink: false,
        blinkInterval: null
      }, callback);
    } else if (this.state.blinkInterval) {
      this.setState({
        blinkInterval: null
      }, callback);
    } else if (typeof callback === 'function') {
      callback();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.char) {
      this.stopBlinking();
    } else if (this.state.blinkInterval === null) {
      this.blink(this.props.intervalMs || defaults.intervalMs);
    }
  }

  componentDidMount() {
    this.blink(this.props.intervalMs || defaults.intervalMs);
  }

  componentWillUnmount() {
    if (this.state.blinkInterval) {
      clearInterval(this.state.blinkInterval);
    }
  }

  render() {
    const classes = Object.assign({}, defaults.classes, this.props.classes);
    let classesString = classes.element;
    if (this.props.char) {
      classesString = `${classesString} ${classes.write}`;
    } else if (this.state.blink) {
      classesString = `${classesString} ${classes.blink}`;
    }

    return (
      <span className={ classesString }>{
        this.props.char || ' '
      }</span>
    );
  }
}

export default Cursor;
