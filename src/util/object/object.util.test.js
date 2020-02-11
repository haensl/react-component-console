import object from './';

describe('object util', () => {
  describe('equals()', () => {
    describe('called without parameters', () => {
      it('throws a TypeError', () => {
        expect(object.equals.bind(null)).toThrow(TypeError);
      });
    });

    describe('called with non objects', () => {
      it('number: throws a TypeError', () => {
        expect(object.equals.bind(null, 1, 2)).toThrow(TypeError);
      });

      it('boolean: throws a TypeError', () => {
        expect(object.equals.bind(null, true, true)).toThrow(TypeError);
      });

      it('string: throws a TypeError', () => {
        expect(object.equals.bind(null, 'foo', 'bar')).toThrow(TypeError);
      });
    });

    describe('null', () => {
      it('returns true', () => {
        expect(
          object.equals(null, null)
        ).toBe(true);
      });
    });

    describe('different prototypes', () => {
      it('returns false', () => {
        expect(
          object.equals(
            new Map(),
            new Image()
          )
        ).toBe(false);
      });
    });

    describe('identical object', () => {
      let a;
      beforeEach(() => {
        a = {
          foo: 'bar',
          bar: 69
        };
      });

      it('returns true', () => {
        expect(object.equals(a, a)).toBe(true);
      });
    });

    describe('equal objects', () => {
      let a;
      let b;

      beforeEach(() => {
        a = {
          foo: 'bar',
          bar: {
            rick: {
              morty: 'rocks!'
            }
          }
        };
        b = {
          foo: 'bar',
          bar: {
            rick: {
              morty: 'rocks!'
            }
          }
        };
      });

      it('returns true', () => {
        expect(object.equals(a, b)).toBe(true);
      });
    });

    describe('property order differs', () => {
      let a;
      let b;

      beforeEach(() => {
        a = {
          foo: 'bar',
          bar: {
            rick: {
              morty: ['rocks!']
            }
          }
        };
        b = {
          bar: {
            rick: {
              morty: ['rocks!']
            }
          },
          foo: 'bar'
        };
      });

      it('returns true', () => {
        expect(object.equals(a, b)).toBe(true);
      });
    });

    describe('not equal', () => {
      let a;
      let b;

      beforeEach(() => {
        a = {
          foo: 69,
          bar: {
            rick: {
              morty: 'rocks!'
            }
          }
        };
        b = {
          foo: 'bar',
          bar: {
            rick: {
              morty: 'rocks!'
            }
          }
        };
      });

      it('returns false', () => {
        expect(object.equals(a, b)).toBe(false);
      });
    });
  });
});
