const esbuild = require('esbuild');

const external = ['native-fetch', 'undici', 'zod'];

// ESM build
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    external,
    bundle: true,
    sourcemap: true,
    minify: false,
    splitting: true,
    format: 'esm',
    target: ['esnext'],
  })
  .catch(() => process.exit(1));

// CJS build
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.cjs.js',
    external,
    bundle: true,
    sourcemap: true,
    minify: false,
    platform: 'node',
    target: ['node16'],
  })
  .catch(() => process.exit(1));
