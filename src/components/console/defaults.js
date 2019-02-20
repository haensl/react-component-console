import { defaults as ps1Defaults } from '../ps1';
import { defaults as lineDefaults } from '../line';
import { defaults as cursorDefaults } from '../cursor';

export default {
  console: {
    append: false,
    classes: {
      element: 'console'
    },
    typing: {
      char: {
        avgMs: 150,
        deviation: 0.3,
        minMs: 50,
        maxMs: Infinity
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
