const equals = (a, b) => {
  if (!(Array.isArray(a) && Array.isArray(b))) {
    throw new Error('Invalid parameter: expected array.');
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (Array.isArray(a[i])
      && Array.isArray(b[i])) {
      if (!equals(a[i], b[i])) {
        return false;
      }
    } else if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

const isSubset = (subset, superset, index = -1) => {
  if (!(Array.isArray(subset) && Array.isArray(superset))) {
    throw new Error('Invalid parameter: expected array.');
  }

  if (subset.length > superset.length) {
    return false;
  }

  if (index > -1) {
    if (index + subset.length >= superset.length) {
      throw new Error('Index out of bounds!');
    }

    return equals(subset, superset.slice(index, index + subset.length));
  }

  for (let i = 0; i + subset.length <= superset.length; i++) {
    if (equals(subset, superset.slice(i, i + subset.length))) {
      return true;
    }
  }

  return false;
};

const util = {
  equals,
  isSubset
};

export default util;

