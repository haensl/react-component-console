import React from 'react';
import ReactDOM from 'react-dom';
import Console from '@haensl/react-component-console';

describe('esm module test', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders without crashing', () => {
    ReactDOM.render(
      <Console
        lines={[
          'ESM module test.'
        ]}
      />,
      container);
    ReactDOM.unmountComponentAtNode(container);
  });
});
