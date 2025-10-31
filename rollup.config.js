import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: !production,
    name: 'EcoViz'
  },
  plugins: [
    // Extract CSS into a separate file
    css({ output: 'bundle.css' }),
    
    // Resolve node_modules
    resolve({
      browser: true,
      dedupe: ['react', 'react-dom']
    }),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Transpile with Babel
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ]
    }),
    
    // Generate HTML file
    html({
      title: 'EcoViz - Interactive Climate Change Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Interactive Global Climate Change Dashboard with 3D visualizations, charts, and data analysis tools' }
      ],
      publicPath: './'
    }),
    
    // Minify in production
    production && terser(),
    
    // Development server
    !production && serve({
      open: true,
      contentBase: 'dist',
      host: 'localhost',
      port: 3000
    }),
    
    // Live reload in development
    !production && livereload('dist')
  ],
  watch: {
    clearScreen: false
  }
};
