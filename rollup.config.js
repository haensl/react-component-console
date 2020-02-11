const nodeResolve = require('rollup-plugin-node-resolve');
const localResolve = require('@haensl/rollup-plugin-local-resolve');
const babel = require('rollup-plugin-babel');
const commonJS = require('rollup-plugin-commonjs');
const minify = require('rollup-plugin-terser').terser;
const postcss = require('rollup-plugin-postcss');
const pkg = require('./package');

const globals = {
  react: 'React',
  deepmerge: 'deepmerge'
};

const copyright = `// ${pkg.homepage} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author.name} <${pkg.author.email}>`;

module.exports = [
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      banner: copyright,
      name: pkg.name,
      globals: globals,
      indent: false
    },
    external: Object.keys(globals),
    plugins: [
      babel({
        babelrc: false,
        exclude: [
          'node_modules/**',
          '**/*.test.js'
        ],
        runtimeHelpers: true,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: [
                  'defaults'
                ]
              }
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ]
      }),
      localResolve(),
      nodeResolve(),
      commonJS({
        include: 'node_modules/**'
      }),
      postcss({
        extensions: [
          '.css'
        ]
      }),
      minify()
    ]
  },
  {
    input: './src/index.js',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
      banner: copyright,
      indent: false,
      name: pkg.name
    },
    external: Object.keys(globals),
    plugins: [
      localResolve(),
      nodeResolve(),
      commonJS({
        include: 'node_modules/**'
      }),
      postcss({
        extensions: [
          '.css'
        ]
      }),
      babel({
        babelrc: false,
        exclude: [
          'node_modules/**',
          '**/*.test.js'
        ],
        runtimeHelpers: true,
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                esmodules: true
              }
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ]
      }),
      minify()
    ]
  }
];
