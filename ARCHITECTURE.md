# Architecture

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- Google Gemini API
- jsPDF

---

## Application Flow

1. User enters AI tools and pricing.
2. Frontend stores data in React state.
3. Audit logic analyzes pricing inefficiencies.
4. AI summary generated through `/api/summary`.
5. Results displayed in dashboard.
6. User can:
   - Save audit to Supabase
   - Download PDF report
   - View audit page

---

## Folder Structure

src/
 ├── app/
 │   ├── api/
 │   │   ├── summary/
 │   │   └── send-email/
 │   ├── audit/[id]/
 │   └── page.tsx
 │
 ├── lib/
 │   └── supabase.ts

---

## Features

- Multi-tool AI audit
- Savings estimation
- AI-generated recommendations
- PDF generation
- Lead capture
- Spam protection using honeypot field
- CI workflow