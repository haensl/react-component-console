import React from 'react';
import { render } from '@testing-library/react';
import Console from '@haensl/react-component-console';

describe('Console', () => {
  it('renders without crashing', () => {
    expect(render.bind(render, <Console lines={['esm module test']} />)).not.toThrow();
  });
});
