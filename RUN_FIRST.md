# Run the app – one place, one way

**Critical:** The app only works when you run it **from inside `nextjs_space`**. If you run `npm run dev` from the parent folder (“Peoples Print”), you will get 404s on every page.

## Every time you open the project

1. Open a terminal.
2. Run **only** this (copy-paste as one block):

```bash
cd "/Users/jillsander/Desktop/Peoples Print/nextjs_space"
rm -rf .next
npm run dev:3010
```

3. Wait until it says “Ready” and shows a URL (e.g. **http://localhost:3010**).
4. Open that URL in your browser.

If port 3010 is in use, either close whatever is using it or use a different port:

```bash
cd "/Users/jillsander/Desktop/Peoples Print/nextjs_space"
rm -rf .next
PORT=4000 npm run dev
```

Then open **http://localhost:4000**.

## First time (or after pulling changes)

```bash
cd "/Users/jillsander/Desktop/Peoples Print"
git pull origin main
cd nextjs_space
npm install --legacy-peer-deps
npx prisma generate
npm run dev:3010
```

## After making code changes

- Save the file. Next.js will hot-reload; refresh the browser once.
- If you don’t see the change: **hard refresh** (Cmd+Shift+R). If it still doesn’t update: stop the server (Ctrl+C), run `rm -rf .next`, then run `npm run dev:3010` again.

## Summary

| Do this | Command / action |
|--------|-------------------|
| Start the app | `cd .../Peoples Print/nextjs_space` then `rm -rf .next` then `npm run dev:3010` |
| See your changes | Save → refresh (or Cmd+Shift+R) |
| Still old or 404? | Stop server (Ctrl+C) → `rm -rf .next` → start again from `nextjs_space` |

**How to get to the Photo Cube page:** Home → **Shop Products** → click the **Photo Cube** card → you’re on the dedicated Photo Cube page. Or go directly to **http://localhost:3010/photo-cube** (use your actual port if different).
