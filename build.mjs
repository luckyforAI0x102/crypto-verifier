import { build } from 'esbuild';
import { copyFile, cp, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const client = join(root, 'src', 'client');
const dist = join(root, 'dist');
const references = join(dist, 'references');

await mkdir(references, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: ['src/client/main.jsx'],
  bundle: true,
  external: ['/assets/*', '/references/*'],
  outfile: 'dist/assets/app.js',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof',
});

await Promise.all([
  copyFile(join(client, 'index.html'), join(dist, 'index.html')),
  cp(join(client, 'assets'), join(dist, 'assets'), { recursive: true }),
  ...Array.from({ length: 14 }, (_, i) =>
    copyFile(join(root, 'design', '(' + (i + 1) + ').jpg'), join(references, (i + 1) + '.jpg'))),
]);
