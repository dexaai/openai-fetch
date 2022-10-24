const esbuild = require('esbuild');

// ESM build
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    external: ['ky'],
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
    bundle: true,
    sourcemap: true,
    minify: false,
    platform: 'node',
    target: ['node16'],
  })
  .catch(() => process.exit(1));
