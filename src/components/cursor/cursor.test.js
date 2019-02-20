import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Cursor from './';

jest.useFakeTimers();

describe('Cursor', () => {
  describe('empty', () => {
    let tree;

    beforeEach(() => {
      tree = renderer.create(<Cursor />);
    });

    it('renders as expeted', () => {
      expect(tree).toMatchSnapshot();
    });
  });
});
