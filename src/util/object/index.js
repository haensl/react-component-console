import array from '../array';

export const equals = (a, b) => {
  if (typeof a !== 'object') {
    throw new TypeError('Invalid parameter. Expected object.');
  }

  if (a === null) {
    return b === null;
  }

  if (typeof a !== typeof b
    || Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)
    || Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  return Object.keys(a)
    .map((key) => {
      if (!(key in b)) {
        return false;
      }

      switch (typeof a[key]) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'undefined':
        case 'function':
          return a[key] === b[key];
        case 'object':
          if (a[key] === null) {
            return b[key] === null;
          }

          if (Array.isArray(a[key])) {
            if (!Array.isArray(b[key])) {
              return false;
            }

            return array.equals(a[key], b[key]);
          }

          return equals(a[key], b[key]);
        default:
          throw new Error(`Unhandled type: ${typeof a[key]} at key ${key}.`);
      }
    })
    .reduce((objectsEqual, propEqual) => objectsEqual && propEqual, true);
};

const util = {
  equals
};

export default util;
