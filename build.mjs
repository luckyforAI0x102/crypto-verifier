import { build } from 'esbuild';
import { copyFile, cp, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const client = join(root, 'src', 'client');
const dist = join(root, 'dist');
await mkdir(dist, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: ['src/client/main.jsx'],
  bundle: true,
  external: ['/assets/*'],
  outfile: 'dist/assets/app.js',
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.HOSTED_PREVIEW': JSON.stringify(false),
  },
  legalComments: 'eof',
});

await Promise.all([
  copyFile(join(client, 'index.html'), join(dist, 'index.html')),
  cp(join(client, 'assets'), join(dist, 'assets'), { recursive: true }),
]);
