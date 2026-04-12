# 🏢 SmartSociety

A full-stack **residential society management platform** built with React + Vite on the frontend and a Node.js/Express REST API on the backend. Designed for three user roles — **Admin**, **Resident**, and **Guard** — with role-based access control, a dark premium UI, and a demo mode for offline exploration.

---

## ✨ Features

### 🛡️ 1. Admin Dashboard — Management Command Center

_For the Secretary or Society Committee._

- **AI Community Pulse** — Analyzes all social feed posts and generates an AI Performance Index with a community sentiment score
- **Member Directory** — Full control over residents and staff. Search by unit, change roles (e.g., promote a resident to Guard)
- **Grievance Tracking** — Centralized hub to manage all complaints. One-click status updates: Pending → In Progress → Resolved
- **Task Broadcasting** — Assign society-wide maintenance or security tasks. Gemini AI automatically sets Priority and Assigned Role
- **Financial Insights** — High-level view of society revenue, utility burn rates, and total balance

---

### 🏠 2. Resident Dashboard — Community Home Hub

_For every apartment owner/tenant._

- **Personal Ledger** — Private view of maintenance dues, upcoming bills, and receipt history with a Pay Now interface
- **Community Feed** — Social wall where residents post updates. AI adds sentiment badges (Positive Vibe, Question) to filter the feed
- **Smart Amenity Booking** — Use AI Voice to describe a booking (e.g., _"Book the gym for tomorrow 6 PM"_) and it auto-populates the form
- **Safety Check-in** — Invite guests digitally. Pre-fill visitor info to speed up gate security
- **Direct Escalation** — Raise complaints to Admin with an AI Voice assistant for long descriptions

---

### 👮 3. Guard Dashboard — Security Hub

_Optimized for a tablet at the Society Main Gate._

- **AI Voice Gate Logs** — Tap once and say _"Delivery for A-102, vehicle 5562."_ AI parses speech into professional data entries
- **QR Scanner** — Live camera interface to scan visitor passes for instant verification
- **AI Priority Security List** — Task list where AI highlights the most urgent security actions (e.g., _"Patrol Gate 2 immediately"_)
- **Digital Registry** — Real-time view of everyone inside the society, searchable by unit, name, or purpose
- **Emergency Contact Board** — Instant access to fire, police, and medical services for the local area

---

### 👤 Role-Based Access Matrix

| Feature            | Admin       | Resident  | Guard     |
| ------------------ | ----------- | --------- | --------- |
| Dashboard          | ✅          | ✅        | ✅        |
| Members Management | ✅          | ✅ (view) | ✅ (view) |
| Complaints         | ✅          | ✅        | ✅        |
| Announcements      | ✅ (create) | —         | —         |
| Visitors           | —           | Invite    | Manage    |
| Gate Live          | —           | —         | ✅        |
| QR Scanner         | —           | —         | ✅        |
| Finance            | ✅          | —         | —         |
| Ledger             | —           | ✅        | —         |
| Amenities          | ✅          | ✅        | —         |
| Meetings           | ✅          | ✅        | —         |
| Staff Directory    | ✅          | —         | —         |
| Society Feed       | ✅          | ✅        | ✅        |
| Task Management    | ✅          | ✅        | ✅        |
| Logs               | ✅          | —         | ✅        |

---

### 🔑 Auth & Society Flow

- Register / Login with JWT-based authentication
- Create or join a society via invite code
- `pending` role for new users awaiting society assignment
- Protected routes with automatic role-based redirects

### 🎨 UI & Design

- Dark premium dashboard aesthetic (`#080B14` background, `#FACC15` gold accent)
- Glassmorphism cards, soft glows, rounded panels
- Framer Motion animations throughout
- Voice input support (`VoiceInput` component)
- Toast notifications via Sonner
- Fully responsive sidebar layout

### 🧪 Demo Mode

- Uses a `mock-token` to bypass real API calls
- Mock members, tasks, and logs pre-loaded for offline exploration
- Axios interceptor short-circuits network calls in demo mode

---

## 🗂 Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance + demo mode interceptor
│   └── index.js          # All API modules (auth, society, members, complaints, etc.)
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx
│   │   └── Sidebar.jsx
│   ├── modals/
│   │   └── MemberDetailsModal.jsx
│   └── ui/               # shadcn-style UI primitives (Button, Card, Badge, etc.)
├── data/
│   └── mockData.js       # Mock data for demo mode
├── lib/
│   └── utils.js          # cn() utility (clsx + tailwind-merge)
├── pages/
│   ├── dashboards/
│   │   ├── AdminDashboard.jsx
│   │   ├── ResidentDashboard.jsx
│   │   └── GuardDashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── SocietySetup.jsx
│   ├── Members.jsx
│   ├── Complaints.jsx
│   ├── Announcements.jsx
│   ├── Visitors.jsx
│   ├── GateLive.jsx
│   ├── Scanner.jsx
│   ├── GuestInvite.jsx
│   ├── SocietyFeed.jsx
│   ├── Finance.jsx
│   ├── Ledger.jsx
│   ├── Amenities.jsx
│   ├── Meetings.jsx
│   ├── ManageTasks.jsx
│   ├── StaffDirectory.jsx
│   ├── Logs.jsx
│   └── Profile.jsx
├── store/
│   ├── authStore.js      # Zustand store — user, token, society, mock members
│   ├── amenityStore.js
│   ├── feedStore.js
│   ├── guestStore.js
│   ├── logStore.js
│   └── taskStore.js
├── App.jsx               # Routes + ProtectedRoute logic
└── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/arya-thakkar/smartsociety.git
cd smartsociety
git checkout arya1
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=https://smartsociety-1.onrender.com/api
```

> The default API base is already set in `src/api/axios.js`. You only need the env variable if you want to override it.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔌 API Reference

The frontend connects to a REST API hosted at `https://smartsociety-1.onrender.com/api`.

| Module        | Endpoints                                                         |
| ------------- | ----------------------------------------------------------------- |
| Auth          | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`         |
| Society       | `POST /society`, `POST /society/join`                             |
| Members       | `GET /members`, `PATCH /members/:id/role`                         |
| Complaints    | `GET /complaints`, `POST /complaints`, `PATCH /complaints/:id`    |
| Visitors      | `GET /visitors`, `POST /visitors`, `PATCH /visitors/:id/checkout` |
| Announcements | `GET /announcements`, `POST /announcements`                       |
| Posts (Feed)  | `GET /posts`, `POST /posts`, `POST /posts/:id/like`               |
| Tasks         | `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`                   |
| Logs          | `GET /logs`, `POST /logs`                                         |
| Statistics    | `GET /stats/admin`, `GET /stats/resident`, `GET /stats/guard`     |

All authenticated endpoints require a `Bearer <token>` header, managed automatically by the Axios interceptor.

---

## 🧰 Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | React 18 + Vite 5                  |
| Routing          | React Router DOM v6                |
| State Management | Zustand                            |
| Data Fetching    | TanStack React Query               |
| HTTP Client      | Axios                              |
| Styling          | Tailwind CSS + tailwindcss-animate |
| UI Components    | Radix UI primitives (shadcn-style) |
| Animations       | Framer Motion                      |
| Charts           | Recharts                           |
| Icons            | Lucide React                       |
| Toasts           | Sonner                             |
| Date Utilities   | date-fns                           |
| Deployment       | Vercel                             |

---

## 🚢 Deployment

The project is configured for Vercel deployment via `vercel.json`.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

All routes are rewritten to `index.html` for SPA support (configured in `vercel.json`).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request against `arya1`

---

## 📄 License

This project is private. All rights reserved.
