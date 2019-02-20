import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Cursor, { DEFAULTS } from './';

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
      expect(tree.props.class).toEqual(DEFAULTS.classes.element);
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
      expect(tree.props.class).toMatch(new RegExp(`${DEFAULTS.classes.write}`));
    });

    it('adds the default element class', () => {
      expect(tree.props.class).toMatch(new RegExp(`${DEFAULTS.classes.element}`));
    });
  });
});
