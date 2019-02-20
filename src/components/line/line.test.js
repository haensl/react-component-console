import React from 'react';
import renderer from 'react-test-renderer';
import Line, { defaults } from './';

describe('Line', () => {
  describe('empty', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Line />)
        .toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });
  });

  describe('ps1', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Line ps1={{
        content: '~'
      }} />).toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });

    it('sets the tilde as content of the ps1 component', () => {
      expect(tree.children[0].children.includes('~')).toBe(true);
    });
  });

  describe('content', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Line content="foo bar" />)
        .toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });

    it('adds "foo bar" as content', () => {
      expect(tree.children[0].children.includes('foo bar')).toBe(true);
    });
  });

  describe('classes', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Line classes={{
        element: 'test-line',
        content: 'test-line-content'
      }} />).toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the test-line element class', () => {
      expect(tree.props.className).toEqual('test-line');
    });

    it('adds the test-line-content content class', () => {
      expect(tree.children[0].props.className).toEqual('test-line-content');
    });
  });

  describe('write', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Line write={ true } cursor={{
        char: 't'
      }} />).toJSON();
    });

    it('renders as expected', () => {
      expect(tree).toMatchSnapshot();
    });

    it('adds the default element class', () => {
      expect(tree.props.className).toEqual(defaults.classes.element);
    });

    it('sets the char under the cursor correctly', () => {
      expect(tree.children[1].children.includes('t')).toBe(true);
    });
  });
});
