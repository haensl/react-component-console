import React from 'react';
import merge from 'deepmerge';
import Line from '../line';
import defaults from './defaults';
import math from '../../util/math';
import array from '../../util/array';

const isClient = typeof window === 'object';

class Console extends React.Component {
  constructor() {
    super();
    this.state = {
      console: {
        text: '',
        hasFinishedWritingLines: false
      },
      initialized: false
    };
  }

  getDelay(opts = defaults.console.typing.char) {
    const sign = math.randSign();
    const deviation = math.random() * opts.deviation;
    const delay = opts.avgMs
      + (opts.avgMs * deviation * sign);
    return Math.max(
      0,
      Math.min(
        opts.maxMs,
        Math.max(
          opts.minMs,
          delay
        )
      )
    );
  }

  consumeLine(line) {
    if (line.length) {
      const c = line.slice(0, 1);
      return new Promise((resolve) => {
        this.setState({
          console: merge(
            this.state.console,
            {
              text: `${this.state.console.text}${c}`
            }
          ),
          cursor: merge(
            this.state.cursor,
            {
              char: c
            }
          ),
          timeouts: (this.state.timeouts || []).concat([
            window.setTimeout((() =>
              this.consumeLine(line.slice(1)).then(resolve))
                .bind(this),
              this.getDelay(this.state.console.typing.char)
            )
          ])
        });
      });
    }

    return Promise.resolve();
  }

  writeLine(line) {
    this.setState({
      console: merge(
        this.state.console,
        {
          text: ''
        }
      )
    });

    const self = this;
    return this.consumeLine(line)
    .then(() => {
      self.setState({
        cursor: merge(
          self.state.cursor,
          {
            char: null
          }
        )
      });
    })
    .then(() => new Promise((resolve) => {
      self.setState({
        timeouts: (self.state.timeouts || []).concat([
          window.setTimeout(() => {
            resolve();
          }, self.getDelay(self.state.console.typing.line.delay))
        ])
      });
    }));
  }

  async writeLines(lines) {
    if (!(Array.isArray(lines) && lines.length)) {
      return;
    }

    for (let currentLine = 0; currentLine < lines.length; currentLine++) {
      this.setState({
        console: merge(
          this.state.console,
          {
            currentLine
          }
        )
      });
      await this.writeLine(lines[currentLine]);
      if (this.state.console.append) {
        this.setState({
          console: merge(
            this.state.console,
            {
              lines: [this.state.lines[currentLine]]
            }
          )
        });
      }
    }

    const newState = merge({}, this.state);
    newState.console.hasFinishedWritingLines = true;

    if (this.state.console.append) {
      newState.console.text = '';
    }

    this.setState(newState);
  }

  get isWriting() {
    return typeof this.state.currentLine === 'number'
      && !this.state.console.hasFinishedWritingLines;
  }

  initialize(props) {
    if (isClient) {
      const state = merge.all([defaults, this.state, props]);
      state.initialized = true;
      if (state.lines
      && typeof state.lines === 'string') {
        state.lines = [ state.lines ];
      }

      this.setState(state);

      if (state.lines
        && state.lines.length) {
        this.writeLines(state.lines);
      }
    }
  }

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (isClient
      && !array.equals(nextProps.lines, this.state.lines)) {
      if (this.isWriting) {
        this.stopWriting();
      }

      this.initialize(nextProps);
    }
  }

  componentWillUnmount() {
    this.stopWriting();
  }

  stopWriting() {
    if (isClient && this.state.timeouts) {
      (this.state.timeouts || []).forEach((t) => window.clearTimeout(t));
      this.setState({
        timeouts: [],
        console: merge(
          this.state.console,
          {
            currentLine: null,
            hasFinishedWritingLines: false
          }
        )
      });
    }
  }

  render() {
    if (!this.state.initialized) {
      return;
    }

    return (
      <div className={ this.state.console.classes.element }>
        {
          (this.state.console.lines || []).map((line) => (
            <Line classes={ this.state.line.classes } content={ line } />
          ))
        }
        <Line classes={ this.state.line.classes }
          write={ true }
          ps1={
            this.state.ps1
          }
          content={
            this.state.console.text
          }
          cursor={
            this.state.cursor
          }
        />
      </div>
    );
  }
}

export default Console;
