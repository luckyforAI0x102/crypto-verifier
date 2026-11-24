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
3. Deploy or redeploy after connecting the store. Complete a sample review and select **Save review**. The first save creates `informations.json` in the connected store. You can inspect the file from the Storage dashboard.

Vercel serves the React build from `dist/` and runs Express at `/api/submissions`. The hosted preview labels each page as an independent practice demo. Only predefined sample choices and numbered demo tiles can be saved. A new store starts empty. Local development continues to use the project’s own `informations.json`.

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

Enter case **980250** in Design preview. On screens 7–9, type or paste the displayed practice word into the text field and press Enter or select **Submit**. On screen 10 choose a device. Its QR code contains a plain-text offline label. Screen 11 lets you choose a demo tile for each of 12 or 24 positions. **Fill empty slots** preserves individual choices. Screen 12 displays the submitted tiles in order for 30 minutes, with copy and edit controls. The demo tile draft stays in this browser tab.

On screen 14 select **Save review** to save the completed review with one click. Expand **Edit and resubmit** if you want to change a choice first.

## Local saved information

Express appends each completed review to `informations.json` in the project root. When you select **Save review**, the `phrase` field stores the 12 or 24 selected demo tile labels in display order, separated by spaces. The record also contains the sample case ID, selected sample email, activity decisions, balance range, contact response, device, layout size, submission ID, and save time. An unfinished review stays in the browser tab.

The server validates the sample choices and serves public assets from `dist/`. Run one Express process per data file. Within that process, writes are serialized and atomically replace the JSON file. Retrying the same submission ID and choices returns the original success without adding another record.
