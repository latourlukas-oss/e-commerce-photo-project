# Peoples Print – Agent instructions

**Read this first when working on this project.** It prevents 404s, wrong-folder runs, and "site not working" confusion.

## One app, one place

- **This repo:** Peoples Print. The **only** Next.js app is in **`nextjs_space/`**.
- **Do not** run `npm run dev` from the repo root. It will 404. Always run from **`nextjs_space/`**.
- **Do not** use or reference the folder `e-commerce-photo-project`; this repo is the source of truth.

## How to run the site (every time)

From the repo root:

```bash
cd nextjs_space
rm -rf .next
npm run dev
```

Or use the root shortcut (see root package.json): **`npm run dev`** from the Peoples Print folder.

Use the URL Next.js prints (e.g. http://localhost:3000). If the port is in use, try **`PORT=3010 npm run dev`** from inside `nextjs_space`.

## Before saying "the site works" or "refresh"

1. Run **`npm run build`** from **`nextjs_space/`** and confirm it completes with "Compiled successfully".
2. Or at least run **`npx tsc --noEmit`** and **lints** on changed files. Do not tell the user to refresh until you've verified the build.

## Key routes

- Homepage: `/` (merch only)
- Photo Cube page: `/photo-cube` (product sidebar → Photo Cube goes to this page)
- Products grid: `/products` (no Photo Cube in the list; only via sidebar)

## Folder layout

- **Peoples Print** (root): git repo, README, RUN_FIRST.md, this file, and **nextjs_space/**.
- **nextjs_space**: The entire Next.js app. All `npm`/`next` commands run from here.
