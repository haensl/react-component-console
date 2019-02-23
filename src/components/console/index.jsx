import React from 'react';
import merge from 'deepmerge';
import Line from '../line';
import defaults from './defaults';
import math from '../../util/math';
import array from '../../util/array';

const isClient = typeof window === 'object';
const initialState = {
  console: {
    text: '',
    hasFinishedWritingLines: false
  },
  initialized: false
};

const overwriteArrays = (dst, src, opts) => src;

class Console extends React.Component {
  constructor() {
    super();
    this.state = merge({}, initialState);
  }

  getDelay(opts = defaults.console.typing.char) {
    const sign = math.randSign();
    const deviation = Math.random() * opts.deviation;
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
              this.getDelay(this.state.console.typing.char) // eslint-disable-line
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

  awaitableSetState(state) {
    const self = this;
    return new Promise((resolve) => {
      self.setState(state, resolve);
    });
  }

  async *linesGenerator() {
    if (!(Array.isArray(this.state.lines) && this.state.lines.length)) {
      return;
    }

    for (let currentLine = this.state.console.currentLine || 0; currentLine < this.state.lines.length; currentLine++) {
      await this.awaitableSetState({
        console: merge(
          this.state.console,
          {
            currentLine
          }
        )
      });

      await this.writeLine(this.state.lines[currentLine]);

      if (this.state.console.append) {
        await this.awaitableSetState({
          console: merge(
            this.state.console,
            {
              lines: [this.state.lines[currentLine]]
            }
          )
        });
      }

      yield this.state.lines[currentLine];
    }
  }

  async writeLines() {
    await this.awaitableSetState({
      console: merge(
        this.state.console,
        { hasFinishedWritingLines: false }
      )
    });

    for await (const line of this.linesGenerator()) {
      if (typeof this.props.onFinishWritingLine === 'function') {
        this.props.onFinishWritingLine(line);
      }
    }
    const newState = merge({}, this.state);
    newState.console.hasFinishedWritingLines = true;

    if (this.state.console.append) {
      newState.console.text = '';
    }

    this.clearTimeouts();
    await this.awaitableSetState(newState);
    if (typeof this.props.onFinishWritingLines === 'function') {
      this.props.onFinishWritingLines(this.state.lines);
    }
  }

  get isWriting() {
    return typeof this.state.console.currentLine === 'number'
      && !this.state.console.hasFinishedWritingLines;
  }

  initialize(props) {
    if (isClient) {
      const state = merge.all([
        defaults,
        this.state,
        initialState,
        props
      ], {
        arrayMerge: overwriteArrays
      });
      state.initialized = true;
      if (state.lines
        && typeof state.lines === 'string') {
        state.lines = [ state.lines ];
      }

      if (Array.isArray(state.lines) && state.lines.length) {
        state.console.currentLine = 0;
      }

      const self = this;
      this.setState(state, () => {
        self.writeLines();
      });
    }
  }

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (isClient && this.state.initialized) {
      if(!array.equals(nextProps.lines, this.state.lines)) {
        if (nextProps.lines.length > this.state.lines.length
          && array.isSubset(this.state.lines, nextProps.lines, 0)) {
          const self = this;
          this.setState(merge.all(
            [
              this.state,
              nextProps,
              {
                lines: Array.isArray(nextProps.lines) && nextProps.lines || [ nextProps.lines ]
              }
            ],
            {
              arrayMerge: overwriteArrays
            }
          ), () => {
            if (!self.isWriting || self.state.console.hasFinishedWritingLines) {
              self.setState({
                console: merge(
                  this.state.console,
                  {
                    text: '',
                    currentLine: self.state.console.currentLine + 1,
                    hasFinishedWritingLines: false
                  }
                )
              }, () => {
                self.writeLines();
              });
            }
          });
        } else {
          if (this.isWriting) {
            this.stopWriting();
          }

          this.initialize(nextProps);
        }
      }
    }
  }

  componentWillUnmount() {
    this.stopWriting();
  }

  clearTimeouts() {
    (this.state.timeouts || []).forEach((t) => window.clearTimeout(t));
    this.setState({
      timeouts: []
    });
  }

  stopWriting() {
    if (isClient && this.state.timeouts) {
      this.clearTimeouts();
      this.setState({
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
      return null;
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
