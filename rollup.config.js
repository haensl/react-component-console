const nodeResolve = require('rollup-plugin-node-resolve');
const localResolve = require('@haensl/rollup-plugin-local-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-terser').terser;
const postcss = require('rollup-plugin-postcss');
const pkg = require('./package');

const globals = {
  react: 'React',
  deepmerge: 'deepmerge',
  regeneratorRuntime: 'regenerator-runtime'
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
      sourcemap: 'inline',
      indent: false
    },
    external: Object.keys(globals),
    plugins: [
      localResolve(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
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
        ],
        runtimeHelpers: true
      }),
      minify({
        sourcemap: true
      })
    ]
  },
  {
    input: './src/index.js',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: 'inline',
      banner: copyright,
      indent: false,
      name: pkg.name
    },
    external: Object.keys(globals),
    plugins: [
      localResolve(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
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
        ],
        runtimeHelpers: true
      }),
      minify({
        sourcemap: true
      })
    ]
  }
];
