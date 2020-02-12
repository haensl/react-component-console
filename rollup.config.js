const nodeResolve = require('rollup-plugin-node-resolve');
const localResolve = require('@haensl/rollup-plugin-local-resolve');
const babel = require('rollup-plugin-babel');
const commonJS = require('rollup-plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const minify = require('rollup-plugin-terser').terser;
const postcss = require('rollup-plugin-postcss');
const pkg = require('./package');

const globals = {
  react: 'React',
  deepmerge: 'deepmerge',
  'regenerator-runtime': 'regeneratorRuntime'
};

const copyright = `// ${pkg.homepage} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author.name} <${pkg.author.email}>`;

module.exports = [
  {
    input: './src/index.js',
    output: {
      esModule: false,
      exports: 'named',
      file: pkg.unpkg,
      format: 'umd',
      banner: copyright,
      name: pkg.name,
      globals: globals,
      indent: false
    },
    plugins: [
      external({
        includeDependencies: true
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
              modules: false
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ]
      }),
      commonJS({
        include: 'node_modules/**'
      }),
      localResolve(),
      nodeResolve(),
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
    output: [
      {
        file: pkg.module,
        format: 'esm',
        banner: copyright,
        indent: false,
        name: pkg.name,
        sourcemap: true
      }
    ],
    plugins: [
      external({
        includeDependencies: true
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
      commonJS({
        include: 'node_modules/**'
      }),
      localResolve(),
      nodeResolve(),
      postcss({
        extensions: [
          '.css'
        ]
      })
    ]
  },
  {
    input: './src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        name: pkg.name,
        indent: false,
        banner: copyright,
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      external({
        includeDependencies: true
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
                node: true
              }
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ]
      }),
      commonJS({
        include: 'node_modules/**'
      }),
      localResolve(),
      nodeResolve(),
      postcss({
        extensions: [
          '.css'
        ]
      })
    ]
  }
];
