# Crypto Verifier

A React and Express site for the 14 screenshots in `design/`. The site opens directly in Design Preview. Each page leads to the next through its form or action button. Screen 13 is a support letter for the selected practice account. Its button opens the submission summary.

## Run locally

Use Node.js 22 or newer. For a fresh checkout, install dependencies and start the app.

```sh
npm ci
npm start
```

Open [the local site](http://127.0.0.1:3000). The workspace already contains a built copy, which can also be launched with `node server.mjs`. After editing the React source, run `node build.mjs` and refresh the page.

## Deploy to Vercel

1. Import this repository into Vercel and select the repository root. The included `vercel.json` sets the build command and output directory. Include the files in `src/client/assets/` when you commit the project.
2. In the project's **Storage** tab, create or connect a **private Blob** store for the environments where reviews should be saved. Use the default environment variable names. [Vercel private storage](https://vercel.com/docs/vercel-blob/private-storage)
3. Deploy or redeploy after connecting the store. Complete a sample review and select **Edit and resubmit**. The first save creates `informations.json` in the connected store. You can inspect the file from the Storage dashboard.

Vercel serves the React build from `dist/` and runs Express at `/api/submissions`. A new store starts empty. Local development uses the project’s own `informations.json`.

## Project structure

The client and server share one private npm package and one dependency lockfile.

| Path | Contents |
| --- | --- |
| `src/client/` | React entry point, screen navigation, pages, components, hooks, styles, and image assets |
| `src/server/app.mjs` | Express API, submission validation, and static file serving |
| `src/server/reviewStore.mjs` | JSON persistence, duplicate submission handling, and file-lock retries |
| `src/shared/scenario.js` | Sample choices and tile rules used by React and Express through `#shared/scenario` |
| `design/` | The 14 original reference images |

`npm run build` rebuilds the browser assets in `dist/`. `npm start` builds and starts the app. `npm run serve` starts Express with the existing build.

## Try a review

Choose any six digits for your case ID. Leading zeros are kept. Enter a fictional email address for the preview. Screens 7–9 let you try six letters of your choice or select **Skip**. The letters are discarded when you leave each screen. Screens 10–12 can also be skipped. To try the wallet exercise, choose a device and arrange 12 or 24 numbered demo tiles in any order.

On screen 14 select **Edit and resubmit** to save the completed review with one click. Expand **Edit choices** if you want to change a choice first.

## Local saved information

Express appends each completed review to `informations.json` in the project root. The record includes the case ID, review choices, submission ID and save time. Only email addresses ending in `.test` are sent to the server. Other addresses are used in the current tab and represented by `null` in the saved review. Skipped device and card selections are also recorded as `null`. Completing the optional card adds a `phrase` field containing the selected demo tile labels.

The server validates the sample choices and serves public assets from `dist/`. Run one Express process per data file. Within that process, writes are serialized and atomically replace the JSON file. Retrying the same submission ID and choices returns the original success without adding another record.
