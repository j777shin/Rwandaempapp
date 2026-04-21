# Rwanda Youth Employment — Frontend

React + Vite + Tailwind CSS frontend for the Rwanda Youth Employment Platform. Provides portals for both **beneficiaries** and **administrators**.

---

## Prerequisites

- **Node.js** 18+
- **npm** 9+
- The **backend API** (`rwanda-emp/api`) running on port `8001`

---

## Project Structure

```
Rwandaempapp/
├── src/
│   ├── main.tsx              # App entry point
│   ├── app/
│   │   ├── App.tsx           # Root component
│   │   ├── routes.ts         # React Router route definitions
│   │   ├── components/       # Shared layout components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── BeneficiaryLayout.tsx
│   │   │   ├── figma/        # Design-system primitives
│   │   │   └── ui/           # Radix/shadcn UI components
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # JWT auth state
│   │   ├── lib/
│   │   │   └── api.ts        # Typed fetch wrapper + API_BASE config
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── admin/        # Admin portal pages
│   │       └── beneficiary/  # Beneficiary portal pages
│   └── styles/               # Global CSS / Tailwind / theme
├── index.html
├── vite.config.ts
├── package.json
├── .env.example
└── .gitignore
```

---

## Quick Start

### 1. Install dependencies

```bash
cd Rwandaempapp
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# URL of the running FastAPI backend (rwanda-emp/api)
VITE_API_BASE=http://localhost:8001
```

If `VITE_API_BASE` is not set, the app defaults to `http://<current-browser-host>:8001`.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot-reload on port 5173 |
| `npm run build` | Build for production — output to `dist/` |
| `npm run preview` | Preview the production build locally on port 4173 |

---

## Application Routes

### Beneficiary Portal (`/beneficiary/*`)

| Route | Page | Description |
|---|---|---|
| `/beneficiary` | Dashboard | Overview of progress and program status |
| `/beneficiary/skillcraft` | SkillCraft Test | Psychometric assessment |
| `/beneficiary/ingazi` | Ingazi | E-learning pathway overview |
| `/beneficiary/ingazi-deepdive` | Ingazi Deep Dive | Detailed course progress |
| `/beneficiary/eligibility` | Eligibility Score | PMT score and selection status |
| `/beneficiary/chatbot` | Chatbot | AI-powered support assistant |
| `/beneficiary/results` | Result Report | Final program results (PDF) |
| `/beneficiary/business-development` | Business Development | Business plan tracking |
| `/beneficiary/survey` | Survey | Program surveys |

### Admin Portal (`/admin/*`)

| Route | Page | Description |
|---|---|---|
| `/admin` | Dashboard | Program-wide KPI overview |
| `/admin/registration` | Data Registration | CSV / manual beneficiary registration |
| `/admin/selection` | Beneficiary Selection | PMT-based selection pipeline |
| `/admin/accounts` | Account Management | User account admin |
| `/admin/progress` | Beneficiary Progress | Individual progress tracking |
| `/admin/track-assignment` | Track Assignment | Assign employment / entrepreneurship tracks |
| `/admin/employment-progress` | Employment Progress | Employment track outcomes |
| `/admin/entrepreneur-progress` | Entrepreneur Progress | Entrepreneurship track outcomes |
| `/admin/phase1-dashboard` | Phase 1 Dashboard | Phase 1 analytics |
| `/admin/phase2-dashboard` | Phase 2 Dashboard | Phase 2 analytics |
| `/admin/phase1-selection` | Phase 1 Selection | Phase 1 cohort selection |
| `/admin/skillcraft-info` | SkillCraft Info | Assessment score overview |
| `/admin/eligibility-management` | Eligibility Management | Score thresholds and overrides |
| `/admin/entrepreneurship` | Entrepreneurship Selection | Entrepreneurship cohort selection |
| `/admin/chatbot-analytics` | Chatbot Analytics | AI chatbot usage stats |
| `/admin/analytics` | Analytics | Aggregate program analytics |
| `/admin/surveys` | Survey Results | Survey response overview |
| `/admin/analysis` | Analysis Dashboard | Advanced data analysis |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE` | No | `http://<host>:8001` | Backend API base URL |

Only variables prefixed with `VITE_` are exposed to the browser by Vite.

---

## Production Build & Deployment

```bash
# 1. Set the production API URL
echo "VITE_API_BASE=http://your-server-ip:8001" > .env

# 2. Build
npm run build        # outputs to dist/

# 3. Preview locally
npm run preview      # http://localhost:4173

# 4. Or serve dist/ with nginx / any static file server
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Blank page after `npm run dev` | Ensure `VITE_API_BASE` points to the running backend |
| `401 Unauthorized` on all API calls | Log in again — JWT may have expired |
| CORS errors in browser | Set `FRONTEND_URL` in `api/.env` to match your browser origin and restart the API |
| `npm install` fails | Ensure Node.js ≥ 18: `node -v` |
| Port 5173 already in use | Kill the process: `lsof -ti:5173 \| xargs kill` |
