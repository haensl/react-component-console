import array from './';

describe('array', () => {
  describe('equals', () => {
    describe('non array', () => {
      it('throws', () => {
        expect(array.equals.bind(null, 1, 2)).toThrow();
      });
    });

    describe('unequal arrays', () => {
      it('returns false', () => {
        expect(array.equals([1, 2, 3], [1, 3, 2])).toBeFalsy();
      });
    });

    describe('equal arrays', () => {
      it('returns true', () => {
        expect(array.equals([1, [2, 3]], [1, [2, 3]])).toBeTruthy();
      });
    });
  });

  describe('isSubset', () => {
    describe('non array', () => {
      it('throws', () => {
        expect(array.isSubset.bind(null, 1, 2)).toThrow();
      });
    });

    describe('index out of bounds', () => {
      it('throws', () => {
        expect(array.isSubset.bind(
          [ 0, 1, 2],
          [ 0, 1, 3],
          2
        )).toThrow();
      });
    });

    describe('no subset', () => {
      describe('no index', () => {
        it('returns false', () => {
          expect(array.isSubset(
            [ 1, 2, 3 ],
            [ 1, 3, 2]
          )).toBeFalsy();
        });
      });

      describe('index', () => {
        it('returns false', () => {
          expect(array.isSubset(
            [ 1, 2, 3],
            [ 0, 1, 2, 3],
            0
          )).toBeFalsy();
        });
      });
    });

    describe('subset', () => {
      describe('no index', () => {
        describe('beginning', () => {
          it('returns true', () => {
            expect(array.isSubset(
              [ 1, 2, 3 ],
              [ 1, 2, 3, 4]
            )).toBeTruthy();
          });
        });

        describe('enclosed', () => {
          it('returns true', () => {
            expect(array.isSubset(
              [ 1, 2, 3 ],
              [ 0, 1, 2, 3, 4]
            )).toBeTruthy();
          });
        });
      });

      describe('index', () => {
        describe('beginning', () => {
          it('returns true', () => {
            expect(array.isSubset(
              [ 1, 2, 3 ],
              [ 1, 2, 3, 4],
              0
            )).toBeTruthy();
          });
        });

        describe('enclosed', () => {
          it('returns true', () => {
            expect(array.isSubset(
              [ 1, 2, 3 ],
              [ 0, 1, 2, 3, 4],
              1
            )).toBeTruthy();
          });
        });
      });
    });
  });
});
