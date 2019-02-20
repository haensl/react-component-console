import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Cursor, { defaults } from './';

jest.useFakeTimers();

describe('Cursor', () => {
  describe('empty', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Cursor />)
        .toJSON();
    });

    it('renders as expeted', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });
  });

  describe('char', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Cursor char="t" />)
        .toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('writes the char', () => {
      expect(tree.children.includes('t')).toBe(true);
    });

    it('adds the default write class', () => {
      expect(tree.props.className).toMatch(new RegExp(`${defaults.classes.write}`));
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toMatch(new RegExp(`${defaults.classes.element}`));
    });
  });

  describe('classes', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Cursor classes={{
        element: 'test-element'
      }} />).toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the test-element class to the element', () => {
      expect(tree.props.className).toEqual('test-element');
    });
  });

  describe('blink', () => {
    let component;

    describe('after the default interval has passed', () => {
      beforeEach(() => {
        component = mount(<Cursor />);
        jest.runTimersToTime(defaults.intervalMs + 1);
        component.update();
      });

      it('adds the blink class', () => {
        expect(component.find('span').first().hasClass(defaults.classes.blink)).toBe(true);
      });

      it('sets the blink state to true', () => {
        expect(component.state('blink')).toBe(true);
      });

      describe('after the default interval has passed a second time', () => {
        beforeEach(() => {
          jest.runTimersToTime(defaults.intervalMs + 1);
          component.update();
        });

        it('removes the blink class', () => {
          expect(component.find('span').first().hasClass(defaults.classes.blink)).toBe(false);
        });

        it('sets the blink state to true', () => {
          expect(component.state('blink')).toBe(false);
        });
      });
    });
  });
});
