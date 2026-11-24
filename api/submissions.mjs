import { createApp } from '../src/server/app.mjs';
import { saveBlobSubmission } from '../src/server/blobReviewStore.mjs';

export default createApp({ saveSubmission: saveBlobSubmission });
