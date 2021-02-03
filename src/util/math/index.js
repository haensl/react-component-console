const randInt = (_min = Number.MIN_SAFE_INTEGER, _max = Number.MAX_SAFE_INTEGER) => {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const randSign = () =>
  (randInt(0, 2) === 1
    && 1)
  || -1;

const util = {
  randInt,
  randSign
};

export default util;
