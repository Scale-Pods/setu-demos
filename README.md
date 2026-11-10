# Setu Demos

Two separate demo apps, front-end only with mocked data (no backend):

- **kumbh/** – Kumbh Mitra
- **ms/** – Matdaan Mitra

## Run locally

```bash
cd kumbh && npm install && npm run dev
cd ms && npm install && npm run dev
```

## Deploy (Vercel)

Each app deploys as its own Vercel project from this repo. Set **Root Directory** to `kumbh` or `ms`, use the Vite preset, then deploy. Each folder has a `vercel.json` (build: `npm run build`, output: `dist`).
