import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import Line from '../line';
import Console from './';
import defaults from './defaults';

jest.useFakeTimers();

const maxCharTimeout = defaults.console.typing.char.avgMs
  + (defaults.console.typing.char.deviation * defaults.console.typing.char.avgMs);
const maxNewlineTimout = defaults.console.typing.line.delay.avgMs
  + (defaults.console.typing.line.delay.deviation * defaults.console.typing.line.delay.avgMs);

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
  });
});

