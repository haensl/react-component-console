import React from 'react';
import renderer from 'react-test-renderer';
import PS1, { defaults } from './';

describe('PS1', () => {
  describe('empty', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<PS1 />)
        .toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });

    it('adds the default content', () => {
      expect(tree.children.includes(defaults.content)).toBe(true);
    });
  });

  describe('content', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<PS1 content="~" />)
        .toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });

    it('adds a tilde as content', () => {
      expect(tree.children.includes('~')).toBe(true);
    });
  });

  describe('classes', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<PS1 classes={{
        element: 'test-ps1'
      }} />).toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the test-ps1 class', () => {
      expect(tree.props.className).toEqual('test-ps1');
    });

    it('adds the default content', () => {
      expect(tree.children.includes(defaults.content)).toBe(true);
    });
  });
});
