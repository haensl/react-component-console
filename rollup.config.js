const nodeResolve = require('rollup-plugin-node-resolve');
const localResolve = require('@haensl/rollup-plugin-local-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-terser').terser;
const postcss = require('rollup-plugin-postcss');

const globals = {
  react: 'React',
  deepmerge: 'deepmerge',
  regeneratorRuntime: 'regenerator-runtime'
};

module.exports = [
  {
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'Console',
        globals: globals,
        sourcemap: 'inline'
      },
      {
        file: 'dist/es/index.js',
        format: 'es',
        globals: globals,
        sourcemap: 'inline'
      }
    ],
    external: Object.keys(globals),
    plugins: [
      localResolve(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      postcss({
        extensions: [
          '.css'
        ]
      }),
      commonjs({
        ignoreGlobal: false,
        include: [
          'node_modules/**'
        ]
      }),
      babel({
        exclude: [
          'node_modules/**',
          '**/*.test.js'
        ]
      }),
      minify({
        sourcemap: true
      })
    ]
  }
];
