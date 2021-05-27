import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import Cursor, { defaults } from './';

jest.useFakeTimers();

describe('Cursor', () => {
  describe('empty', () => {
    let tree;

    beforeEach(() => {
      tree = shallow(<Cursor />);
    });

    it('renders as expeted', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props().className).toEqual(defaults.classes.element);
    });
  });

  describe('char', () => {
    let tree;

    beforeEach(() => {
      tree = mount(<Cursor char="t" />);
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('writes the char', () => {
      expect(tree.children().first().text()).toEqual('t');
    });

    it('adds the default write class', () => {
      expect(tree.children().first().hasClass(defaults.classes.write)).toBe(true);
    });

    it('adds the default element class', () => {
      expect(tree.children().first().hasClass(defaults.classes.element)).toBe(true);
    });
  });

  describe('classes', () => {
    let tree;

    beforeEach(() => {
      tree = shallow(<Cursor classes={{
        element: 'test-element'
      }} />);
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the test-element class to the element', () => {
      expect(tree.props().className).toEqual('test-element');
    });
  });

  describe('blink', () => {
    let component;

    describe('after the default interval has passed', () => {
      beforeEach(() => {
        component = mount(<Cursor />);
        act(() => {
          jest.advanceTimersByTime(defaults.intervalMs + 1);
          component.update();
        });
      });

      it('adds the blink class', () => {
        expect(component.find('span').first().hasClass(defaults.classes.blink)).toBe(true);
      });

      describe('after the default interval has passed a second time', () => {
        beforeEach(() => {
          act(() => {
            jest.advanceTimersByTime(defaults.intervalMs + 1);
            component.update();
          });
        });

        it('removes the blink class', () => {
          expect(component.find('span').first().hasClass(defaults.classes.blink)).toBe(false);
        });
      });
    });
  });
});
