# Peoples Print – Run locally

Use this list in order whenever you open the project. Run from the **Peoples Print** folder (this folder).

---

## 1. Get latest code (do this first)

```bash
cd "/Users/jillsander/Desktop/Peoples Print"
git pull origin main
```

---

## 2. Install dependencies (first time, or after package.json changes)

```bash
cd "/Users/jillsander/Desktop/Peoples Print/nextjs_space"
npm install --legacy-peer-deps
```

---

## 3. Generate Prisma client (required before first run, and after schema changes)

```bash
cd "/Users/jillsander/Desktop/Peoples Print/nextjs_space"
npx prisma generate
```

---

## 4. Start the dev server

From the **Peoples Print** folder run:

```bash
cd "/Users/jillsander/Desktop/Peoples Print"
npm run start
```

The terminal will print a line like **http://localhost:3030** (the port may be 3030, 3031, 3032, etc. if one is in use). Open that URL in your browser.

---

## One-line "run everything" (after you've already run step 2 at least once)

From this folder:

```bash
cd "/Users/jillsander/Desktop/Peoples Print" && git pull origin main && cd nextjs_space && npx prisma generate && npm run dev:3010
```

---

## Optional: database (if you use a real DB)

```bash
cd "/Users/jillsander/Desktop/Peoples Print/nextjs_space"
npx prisma db push
npx prisma db seed
```

---

## One-line start (from Peoples Print root)

From this folder you can also run:

```bash
npm run dev
```

That runs the app from `nextjs_space` with a clean build. Use the URL Next.js prints.

---

## For AI agents
See **AGENTS.md** in this folder for project rules and how to run/verify the site.
