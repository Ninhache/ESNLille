import localFont from 'next/font/local';

export const display = localFont({
  src: [
    { path: '../fonts/display-300.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/display-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/display-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-kelson',
  display: 'swap',
});

export const lato = localFont({
  src: [
    { path: '../../node_modules/@fontsource/lato/files/lato-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/lato/files/lato-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../../node_modules/@fontsource/lato/files/lato-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../node_modules/@fontsource/lato/files/lato-latin-700-italic.woff2', weight: '700', style: 'italic' },
    { path: '../../node_modules/@fontsource/lato/files/lato-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-lato',
  display: 'swap',
});
