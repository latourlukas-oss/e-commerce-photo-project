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

```bash
cd "/Users/jillsander/Desktop/Peoples Print/nextjs_space"
npm run dev:3010
```

Then open in your browser: **http://localhost:3010**

If port 3010 is in use, run instead:

```bash
PORT=3020 npm run dev
```

and open **http://localhost:3020**.

---

## One-line “run everything” (after you’ve already run step 2 at least once)

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

## Folder structure

- **Peoples Print** (this folder) – project root, git repo
- **nextjs_space** – the Next.js app; all `npm` commands run from inside `nextjs_space`

For more detail (env vars, Stripe, etc.), see **nextjs_space/README.md**.
