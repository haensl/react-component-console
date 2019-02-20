const path = require('path');
const { createConfig, babel } = require('webpack-blocks');

module.exports = {
  title: 'react-component-console',
  components: 'src/**/*.{js,jsx}',
  styleguideDir: path.join(__dirname, 'styleguide'),
  webpackConfig: createConfig([babel()]),
  exampleMode: 'expand',
  usageMode: 'expand',
  sections: [
    {
      name: '',
      content: 'README.md'
    },
    {
      name: 'Examples',
      components: './src/test.jsx'
    }
  ]
};
