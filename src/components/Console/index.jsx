import React from 'react';
import merge from 'deepmerge';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import Line from '../Line';
import defaults from './defaults';
import math from '../../util/math';
import array from '../../util/array';
import object from '../../util/object';

const isClient = typeof window === 'object';
const initialState = {
  console: {
    text: '',
    hasFinishedWritingLines: false
  },
  lines: null,
  initialized: false
};

const overwriteArrays = (dst, src, opts) => src;

class Console extends React.Component {
  _isMounted = false;

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

  async consumeLine(line) {
    if (line.length && this.isMounted) {
      const c = line.slice(0, 1);
      await new Promise((resolve) => {
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
              this.consumeLine(line.slice(1)).then(resolve)),
              this.getDelay(this.state.console.typing.char) // eslint-disable-line
            )
          ])
        });
      });
    }

    return Promise.resolve();
  }

  async writeLine(line) {
    if (!this.isMounted) {
      return;
    }

    await this.awaitableSetState({
      console: merge(
        this.state.console,
        {
          text: ''
        }
      )
    });
    await this.consumeLine(line);
    await this.awaitableSetState({
      cursor: merge(
        this.state.cursor,
        {
          char: null
        }
      )
    });
    const self = this;
    return new Promise((resolve) => {
      self.setState({
        timeouts: (self.state.timeouts || []).concat([
          window.setTimeout(() => {
            resolve();
          }, self.getDelay(self.state.console.typing.line.delay))
        ])
      });
    });
  }

  awaitableSetState(state) {
    if (this.isMounted) {
      const self = this;
      return new Promise((resolve) => {
        self.setState(state, resolve);
      });
    }
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
    if (!this.isMounted) {
      return;
    }

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

  get isMounted() {
    return this._isMounted;
  }

  async initialize(props) {
    if (isClient) {
      await this.updateFromProps(
        props,
        {
          ...initialState,
          lines: this.state.lines,
          initialized: true
        }
      );

      const lines = this.linesFromProps(props);
      if (lines) {
        this.onReceiveLines(lines);
      }
    }
  }

  linesFromProps(props) {
    if (!props || !props.lines) {
      return null;
    }

    if (Array.isArray(props.lines)) {
      return props.lines.map((line) => line.toString());
    } else {
      return [ props.lines.toString() ];
    }
  }

  async updateFromProps(props, overwrites = {}) {
    const newState = merge.all([
      defaults,
      this.state,
      props,
      overwrites
    ], {
      arrayMerge: overwriteArrays
    });

    if (!object.equals(newState, this.state)) {
      await this.awaitableSetState(newState);
    }
  }

  async onReceiveLines(nextLines) {
    if (!Array.isArray(nextLines)) {
      throw new Error(`Invalid parameter: Lines. Expected Array. Received ${typeof nextLines}\n${nextLines}`);
    }

    if (!this.state.lines) {
      await this.awaitableSetState({
        console: merge(
          this.state.console,
          {
            text: '',
            currentLine: 0,
            hasFinishedWritingLines: false
          }
        ),
        lines: nextLines
      });
      this.writeLines();
      return;
    }

    if (array.equals(nextLines, this.state.lines)) {
      return;
    }

    // lines added
    if (nextLines.length > this.state.lines.length
      && array.isSubset(this.state.lines, nextLines, 0)) {
      await this.awaitableSetState({
        lines: nextLines
      });
      if (!this.isWriting || this.state.console.hasFinishedWritingLines) {
        await this.awaitableSetState({
          console: merge(
            this.state.console,
            {
              text: '',
              currentLine: this.state.console.currentLine + 1,
              hasFinishedWritingLines: false
            }
          )
        });
        this.writeLines();
      }
    // lines removed
    } else if (nextLines.length < this.state.lines.length
      && array.isSubset(nextLines, this.state.lines)) {
      await this.awaitableSetState({
        lines: nextLines
      });
      if (this.isWriting
        && this.state.console.currentLine >= nextLines.length) {
        await this.stopWriting();
        await this.awaitableSetState({
          console: merge(
            this.state.console,
            {
              text: nextLines[nextLines.length - 1],
              currentLine: nextLines.length - 1,
              hasFinishedWritingLines: true
            }
          )
        });
      } else if (!this.isWriting) {
        await this.awaitableSetState({
          console: merge(
            this.state.console,
            {
              text: nextLines[nextLines.length - 1],
              currentLine: nextLines.length - 1,
              hasFinishedWritingLines: true
            }
          )
        });
      }
    // lines changed
    } else {
      if (this.isWriting) {
        this.stopWriting();
      }

      await this.awaitableSetState({
        console: merge(
          this.state.console,
          {
            text: '',
            currentLine: 0,
            hasFinishedWritingLines: false
          }
        ),
        lines: nextLines
      });
      this.writeLines();
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.initialize(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!(isClient && this.state.initialized)
      || prevProps === this.props) {
      return;
    }

    const currentLines = Array.isArray(prevState.lines)
      ? [].concat(prevState.lines)
      : null;
    this.updateFromProps(this.props, {
      lines: currentLines
    });
    const lines = this.linesFromProps(this.props);
    if (lines) {
      this.onReceiveLines(lines);
    }
  }

  componentWillUnmount() {
    (this.state.timeouts || []).forEach((t) => window.clearTimeout(t));
    this._isMounted = false;
  }

  async clearTimeouts() {
    (this.state.timeouts || []).forEach((t) => window.clearTimeout(t));
    await this.awaitableSetState({
      timeouts: []
    });
  }

  async stopWriting() {
    if (isClient && this.state.timeouts) {
      await this.clearTimeouts();
      await this.awaitableSetState({
        console: merge(
          this.state.console,
          {
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
          (this.state.console.lines || []).map((line, index) => (
            <Line classes={ this.state.line.classes } content={ line } key={ index } />
          ))
        }
        <Line classes={ this.state.line.classes }
          key={ 'active' }
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
