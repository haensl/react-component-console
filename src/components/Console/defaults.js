import { defaults as ps1Defaults } from '../PS1';
import { defaults as lineDefaults } from '../Line';
import { defaults as cursorDefaults } from '../Cursor';

const defaults = {
  console: {
    append: false,
    classes: {
      element: 'Console'
    },
    typing: {
      char: {
        avgMs: 150,
        deviation: 0.3,
        minMs: 50,
        maxMs: Number.MAX_SAFE_INTEGER
      },
      line: {
        delay: {
          avgMs: 1000,
          deviation: 0.5,
          minMs: 500,
          maxMs: 1500
        }
      }
    }
  },
  line: lineDefaults,
  ps1: ps1Defaults,
  cursor: cursorDefaults
};

export default defaults;
