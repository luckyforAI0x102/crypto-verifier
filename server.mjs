import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './src/server/app.mjs';
import { openReviewStore } from './src/server/reviewStore.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const file = join(process.env.CASEFILE_DATA_DIR || root, 'informations.json');
const saveSubmission = await openReviewStore(file);
const app = createApp({ publicDir: join(root, 'dist'), saveSubmission });

const host = process.env.HOST || '127.0.0.1';
const server = app.listen(Number(process.env.PORT || 3000), host, () => {
  console.log('Crypto Verifier is running at http://' + host + ':' + server.address().port);
});
