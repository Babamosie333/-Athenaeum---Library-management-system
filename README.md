# Athenaeum — Library Management System

MERN stack library management app with Clerk auth, Cloudinary image uploads, and a professional light-theme UI. Deploys as two separate Vercel projects (frontend + backend).

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router + Recharts + Clerk React
- **Backend:** Node.js + Express (as a Vercel serverless function) + Mongoose + Clerk SDK + Cloudinary
- **Database:** MongoDB Atlas

## Features
- Clerk auth (sign up / sign in), roles stored in Clerk `publicMetadata.role` (`admin` / `member`)
- Book catalog: search, genre filter, pagination
- Borrow / return with due dates and automatic late fines
- Reservation waitlist — auto-notifies the next person in line on return
- Reviews & ratings, auto-recalculated book rating
- "You may also like" recommendations (same genre/author)
- Admin dashboard: add/delete books (with Cloudinary cover upload), view & manage all transactions, genre analytics chart

## Local Setup

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, CLERK_SECRET_KEY, CLOUDINARY_* keys
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # fill in VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL
npm install
npm run dev
```

## Setting up Clerk
1. Create an app at https://dashboard.clerk.com
2. Copy the **Publishable Key** → frontend `.env` (`VITE_CLERK_PUBLISHABLE_KEY`)
3. Copy the **Secret Key** → backend `.env` (`CLERK_SECRET_KEY`)
4. To make a user an admin: Clerk Dashboard → Users → select user → Metadata → add to **Public metadata**:
   ```json
   { "role": "admin" }
   ```
   (or use the `PATCH /api/users/:id/role` endpoint once you have one admin set up manually)

## Setting up Cloudinary
1. Create a free account at https://cloudinary.com
2. Grab Cloud Name, API Key, API Secret from the dashboard → backend `.env`

## Deploying to Vercel (two separate projects)

### Backend
1. Push `backend/` as its own Vercel project (or set it as the root directory in Vercel's project settings if using a monorepo)
2. Add all `.env` variables in Vercel → Project → Settings → Environment Variables
3. Set `FRONTEND_URL` to your deployed frontend URL (for CORS)
4. Deploy — your API will be live at `https://your-backend.vercel.app/api/...`

### Frontend
1. Push `frontend/` as its own Vercel project
2. Add `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL` (pointing to your deployed backend, e.g. `https://your-backend.vercel.app/api`) in Vercel env vars
3. Deploy

### Clerk redirect URLs
In Clerk Dashboard → your app → Paths, add your deployed frontend domain to allowed origins/redirects.

## Project Structure
```
library-management/
├── backend/
│   ├── api/index.js          → Vercel serverless entry point
│   └── src/
│       ├── config/           → db.js, cloudinary.js
│       ├── middleware/       → auth.js (Clerk verification + role guard)
│       ├── models/           → Book, Transaction, Reservation, Review
│       ├── controllers/
│       ├── routes/
│       └── app.js
└── frontend/
    └── src/
        ├── api/               → axios instance + Clerk token interceptor
        ├── components/        → Navbar, BookCard
        └── pages/             → Home, BookDetails, MyBorrows, Dashboard, Sign In/Up
```

## Notes / Next Steps
- Email notifications (Nodemailer) for due-date reminders and reservation availability are stubbed as a comment in `transactionController.js` — wire up an email service when ready.
- Real-time notifications via Socket.io aren't included here since Vercel serverless functions don't support persistent WebSocket connections — you'd need a small separate always-on service (e.g. Render, like your `drivefolio-server`) for that.
- Barcode/ISBN lookup and multi-branch support are listed as advanced features you can add on top of this scaffold.
