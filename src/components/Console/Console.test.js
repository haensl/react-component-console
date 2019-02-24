import React from 'react';
import { shallow, mount } from 'enzyme';
import Console from './';
import defaults from './defaults';

jest.useFakeTimers();

const maxCharTimeout = defaults.console.typing.char.avgMs
  + (defaults.console.typing.char.deviation * defaults.console.typing.char.avgMs);
const maxNewlineTimeout = defaults.console.typing.line.delay.avgMs
  + (defaults.console.typing.line.delay.deviation * defaults.console.typing.line.delay.avgMs);
const waitForAsync = () => new Promise((resolve) => setImmediate(resolve));

describe('Console', () => {
  let tree;
  let component;

  describe('empty', () => {
    beforeEach(() => {
      tree = shallow(<Console />);
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default class to the element', () => {
      expect(tree.hasClass(defaults.console.classes.element)).toBe(true);
    });

    it('renders the Line component', () => {
      expect(tree.find('Line').length).toBe(1);
    });
  });

  describe('writing', () => {
    describe('string', () => {
      let line;
      let lineCallback;
      let linesCallback;

      beforeEach(async () => {
        line = 'test line.';
        lineCallback = jest.fn();
        linesCallback = jest.fn();
        component = mount(
          <Console
            lines={ line }
            onFinishWritingLines={ linesCallback }
            onFinishWritingLine={ lineCallback }
          />
        );
        await waitForAsync();
      });

      it('renders as expected', () => {
        component.update();
        expect(component).toMatchSnapshot();
      });

      describe('Cursor', () => {
        it('writes the first character', () => {
          component.update();
          expect(component.find('Cursor').prop('char')).toEqual('t');
        });
      });

      describe('Line', () => {
        it('writes the first character', () => {
          component.update();
          expect(component.find('Line').prop('content')).toEqual('t');
        });
      });

      describe('after some time', () => {
        beforeEach(() => {
          jest.advanceTimersByTime(maxCharTimeout);
          component.update();
        });

        it('renders as expected', () => {
          expect(component).toMatchSnapshot();
        });

        describe('Cursor', () => {
          it('writes the second character', () => {
            expect(component.find('Cursor').prop('char')).toEqual('e');
          });
        });

        describe('Line', () => {
          it('writes the first two characters', () => {
            expect(component.find('Line').prop('content')).toEqual('te');
          });
        });

        describe('after the whole line has been written', () => {
          beforeEach(() => {
            for (let i = 0; i < line.length; i++) {
              jest.advanceTimersByTime(maxCharTimeout);
              component.update();
            }
          });

          it('renders as expected', () => {
            expect(component).toMatchSnapshot();
          });

          describe('Cursor', () => {
            it('writes the last character', () => {
              expect(component.find('Cursor').prop('char')).toEqual('.');
            });
          });

          describe('Line', () => {
            it('contains the whole line', () => {
              expect(component.find('Line').prop('content')).toEqual(line);
            });
          });

          describe('onFinishWritingLines', () => {
            beforeEach(async () => {
              await waitForAsync();
              jest.runOnlyPendingTimers();
              await waitForAsync();
              jest.runOnlyPendingTimers();
            });

            it('calls the onFinishWritingLines callback', () => {
              expect(linesCallback).toHaveBeenCalled();
            });
          });

          describe('onFinishWritingLine', () => {
            beforeEach(async () => {
              await waitForAsync();
              jest.runOnlyPendingTimers();
            });

            it('calls the onFinishWritingLines callback', () => {
              expect(lineCallback).toHaveBeenCalledWith(line);
            });
          });
        });
      });
    });

    describe('array of strings', () => {
      let line;
      let lines;
      let props;
      let lineCallback;
      let linesCallback;

      beforeEach(async () => {
        lineCallback = jest.fn();
        linesCallback = jest.fn();
        lines = [
          'test line.',
          'another line.'
        ];
        props = {
          lines
        };
        component = mount(
          <Console { ...props }
            onFinishWritingLine={ lineCallback }
            onFinishWritingLines={ linesCallback }
          />
        );
        await waitForAsync();
      });

      describe('first line', () => {
        beforeEach(() => {
          line = lines[0];
          component.update();
        });

        it('renders as expected', () => {
          expect(component).toMatchSnapshot();
        });

        describe('Cursor', () => {
          it('writes the first character', () => {
            expect(component.find('Cursor').prop('char')).toEqual(line.slice(0, 1));
          });
        });

        describe('Line', () => {
          it('writes the first character', () => {
            expect(component.find('Line').prop('content')).toEqual(line.slice(0, 1));
          });
        });

        describe('after some time', () => {
          beforeEach(() => {
            jest.advanceTimersByTime(maxCharTimeout);
            component.update();
          });

          it('renders as expected', () => {
            expect(component).toMatchSnapshot();
          });

          describe('Cursor', () => {
            it('writes the second character', () => {
              expect(component.find('Cursor').prop('char')).toEqual(line.slice(1, 2));
            });
          });

          describe('Line', () => {
            it('writes the first two characters', () => {
              expect(component.find('Line').prop('content')).toEqual(line.slice(0, 2));
            });
          });

          describe('after the whole line has been written', () => {
            beforeEach(() => {
              for (let i = 2; i < line.length; i++) {
                jest.advanceTimersByTime(maxCharTimeout);
                component.update();
              }
            });

            it('renders as expected', () => {
              expect(component).toMatchSnapshot();
            });

            describe('Cursor', () => {
              it('writes the last character', () => {
                expect(component.find('Cursor').prop('char')).toEqual(line.slice(-1));
              });
            });

            describe('Line', () => {
              it('contains the whole line', () => {
                expect(component.find('Line').prop('content')).toEqual(line);
              });
            });

            describe('second line', () => {
              beforeEach(async () => {
                line = lines[1];
                await waitForAsync();
                jest.advanceTimersByTime(maxNewlineTimeout);
                await waitForAsync();
                component.update();
              });

              describe('onFinishWritingLine', () => {
                it('calls the onFinishWritingLine callback', () => {
                  expect(lineCallback).toHaveBeenCalledWith(lines[0]);
                });
              });

              it('renders as expected', () => {
                expect(component).toMatchSnapshot();
              });

              describe('Cursor', () => {
                it('writes the first character of the second line', () => {
                  expect(component.find('Cursor').prop('char')).toEqual(line.slice(0, 1));
                });
              });

              describe('Line', () => {
                it('contains the first character', () => {
                  expect(component.find('Line').prop('content')).toEqual(line.slice(0, 1));
                });
              });

              describe('after some time', () => {
                beforeEach(() => {
                  jest.advanceTimersByTime(maxCharTimeout);
                  component.update();
                });

                it('renders as expected', () => {
                  expect(component).toMatchSnapshot();
                });

                describe('Cursor', () => {
                  it('writes the second character of the second line', () => {
                    expect(component.find('Cursor').prop('char')).toEqual(line.slice(1, 2));
                  });
                });

                describe('Line', () => {
                  it('contains the first two characters of the second line', () => {
                    expect(component.find('Line').prop('content')).toEqual(line.slice(0, 2));
                  });
                });

                describe('after the whole second line has been written', () => {
                  beforeEach(() => {
                    for (let i = 2; i < line.length; i++) {
                      jest.advanceTimersByTime(maxCharTimeout);
                      component.update();
                    }
                  });

                  it('renders as expected', () => {
                    expect(component).toMatchSnapshot();
                  });

                  describe('Cursor', () => {
                    it('writes the last character of the second line', () => {
                      expect(component.find('Cursor').prop('char')).toEqual(line.slice(-1));
                    });
                  });

                  describe('Line', () => {
                    it('contains the whole second line', () => {
                      expect(component.find('Line').prop('content')).toEqual(line);
                    });
                  });

                  describe('onFinishWritingLine', () => {
                    beforeEach(async () => {
                      await waitForAsync();
                      jest.runOnlyPendingTimers();
                    });

                    it('calls the onFinishWritingLine callback the second time', () => {
                      expect(lineCallback).toHaveBeenCalledTimes(2);
                    });
                  });

                  describe('onFinishWritingLines', () => {
                    beforeEach(async () => {
                      await waitForAsync();
                      jest.runOnlyPendingTimers();
                      await waitForAsync();
                      jest.runOnlyPendingTimers();
                    });

                    it('calls the onFinishWritingLines callback', () => {
                      expect(linesCallback).toHaveBeenCalled();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

