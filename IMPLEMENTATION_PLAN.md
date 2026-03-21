# Job Prep Intel — SaaS Implementation Plan

## Overview

Build a web application where users paste a job description, describe their background, and receive a comprehensive AI-generated intelligence brief with gap analysis, learning sprint plan, and AI acceleration tactics. Powered by the Anthropic API with Claude generating briefs in real-time using the job-prep-intel skill.

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Anthropic SDK + Vercel + Supabase (auth + database)

**Repo:** https://github.com/jposn3r/job-prep (existing repo with .jsx briefs and SKILL.md)

---

## Phase 1: Migrate to Next.js (Day 1)

### Goal
Convert the existing Vite + React repo into a Next.js 15 App Router project deployed on Vercel.

### Steps

1. **Create a new Next.js project in a separate directory:**
   ```bash
   npx create-next-app@latest job-prep-next --typescript --tailwind --app --src-dir --no-turbopack
   cd job-prep-next
   ```

2. **Copy existing assets into the new project:**
   - Copy all `.jsx` brief files from the old repo into `src/app/briefs/[slug]/` (each brief becomes a page)
   - Copy `job-prep-dashboard.jsx` into `src/components/Dashboard.tsx` (convert to TypeScript)
   - Copy `SKILL.md` into the project root and also into `src/lib/skill.ts` as an exported string constant

3. **Set up the project structure:**
   ```
   job-prep-next/
   ├── public/
   ├── src/
   │   ├── app/
   │   │   ├── layout.tsx              # Root layout with fonts, metadata
   │   │   ├── page.tsx                # Landing page (marketing/hero)
   │   │   ├── dashboard/
   │   │   │   └── page.tsx            # Dashboard view
   │   │   ├── briefs/
   │   │   │   └── [slug]/
   │   │   │       └── page.tsx        # Dynamic brief viewer
   │   │   ├── generate/
   │   │   │   └── page.tsx            # Brief generation form
   │   │   └── api/
   │   │       └── generate/
   │   │           └── route.ts        # Anthropic API endpoint
   │   ├── components/
   │   │   ├── Dashboard.tsx           # Migrated dashboard component
   │   │   ├── BriefViewer.tsx         # Generic brief rendering component
   │   │   ├── GenerateForm.tsx        # Job description + background input form
   │   │   ├── StreamingBrief.tsx      # Real-time brief rendering during generation
   │   │   ├── Nav.tsx                 # Top navigation bar
   │   │   └── ui/                     # Shared UI primitives (Badge, ProgressBar, etc.)
   │   ├── lib/
   │   │   ├── skill.ts               # SKILL.md content as a string constant
   │   │   ├── anthropic.ts           # Anthropic SDK client setup
   │   │   ├── prompts.ts             # Prompt construction helpers
   │   │   └── types.ts               # TypeScript types for briefs, roles, etc.
   │   └── styles/
   │       └── globals.css            # Tailwind + custom styles
   ├── SKILL.md
   ├── .env.local                     # ANTHROPIC_API_KEY (never commit this)
   ├── next.config.ts
   ├── tailwind.config.ts
   ├── tsconfig.json
   └── package.json
   ```

4. **Install dependencies:**
   ```bash
   npm install @anthropic-ai/sdk
   npm install ai                    # Vercel AI SDK for streaming helpers
   ```

5. **Set up environment variables:**
   Create `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
   Make sure `.env.local` is in `.gitignore` (Next.js does this by default).

6. **Set up root layout** (`src/app/layout.tsx`):
   - Import Google Fonts (DM Sans, IBM Plex Sans, IBM Plex Mono, JetBrains Mono)
   - Set metadata (title, description, OG tags)
   - Dark theme body styling
   - Include the Nav component

7. **Create a minimal landing page** (`src/app/page.tsx`):
   - Hero section: "Turn any job posting into an AI-powered preparation plan"
   - CTA button: "Generate Your Brief" → links to `/generate`
   - Secondary CTA: "View Example Briefs" → links to `/dashboard`
   - Keep it simple for now — polish later

8. **Migrate the dashboard** to `src/app/dashboard/page.tsx`:
   - Convert the existing `job-prep-dashboard.jsx` to TypeScript
   - This is a client component (`"use client"` at top)
   - Link each role card to `/briefs/[slug]`

9. **Create dynamic brief pages** at `src/app/briefs/[slug]/page.tsx`:
   - Map slugs to brief components
   - Each brief component needs `"use client"` since they use useState
   - Example: `/briefs/anthropic-consumer-pm` renders the Consumer PM brief

10. **Deploy to Vercel:**
    ```bash
    # Install Vercel CLI
    npm i -g vercel

    # Deploy
    vercel

    # Follow prompts — link to your GitHub repo
    # Set environment variable ANTHROPIC_API_KEY in Vercel dashboard
    ```

### Verification
- Landing page loads at your Vercel URL
- Dashboard shows all 7 roles at `/dashboard`
- Each brief renders at `/briefs/[slug]`
- No build errors

---

## Phase 2: Brief Generation API (Day 2-3)

### Goal
Build the backend API route that takes a job description + user background and returns a streaming brief from Claude.

### Steps

1. **Create the Anthropic client** (`src/lib/anthropic.ts`):
   ```typescript
   import Anthropic from "@anthropic-ai/sdk";

   export const anthropic = new Anthropic({
     apiKey: process.env.ANTHROPIC_API_KEY,
   });
   ```

2. **Create the skill prompt** (`src/lib/skill.ts`):
   - Export the full SKILL.md content as a string constant
   - This becomes the system prompt for every generation request
   - Modify the output section: instead of producing a React artifact, instruct Claude to produce structured JSON with all 7 sections (opportunity, company intel, fit analysis, knowledge map, sprint plan, AI tactics, resources)

3. **Define TypeScript types** (`src/lib/types.ts`):
   ```typescript
   export interface GenerateRequest {
     jobDescription: string;
     companyName: string;
     userBackground: string;
     timeline?: number;        // days, default 30
     hoursPerDay?: number;     // default 3-4
     concerns?: string;
   }

   export interface BriefSection {
     id: string;
     title: string;
     icon: string;
     content: any;             // varies by section type
   }

   export interface GeneratedBrief {
     id: string;
     createdAt: string;
     role: string;
     company: string;
     sections: BriefSection[];
     summary: {
       fitAssessment: string;
       biggestGap: string;
       strongestAngle: string;
       startToday: string;
     };
   }
   ```

4. **Create the prompt builder** (`src/lib/prompts.ts`):
   ```typescript
   export function buildGenerationPrompt(input: GenerateRequest): string {
     return `
   ## Job Description
   ${input.jobDescription}

   ## Company
   ${input.companyName}

   ## User Background
   ${input.userBackground}

   ## Preparation Timeline
   ${input.timeline || 30} days, ${input.hoursPerDay || "3-4"} hours per day

   ${input.concerns ? `## Specific Concerns\n${input.concerns}` : ""}

   ## Output Instructions
   Follow the job-prep-intel skill instructions in your system prompt.
   Research the company and domain thoroughly using web search.
   Produce the intelligence brief as a JSON object with the following structure:
   {
     "role": "...",
     "company": "...",
     "sections": [
       { "id": "opportunity", "title": "The Opportunity", "content": { ... } },
       { "id": "intel", "title": "Company Intel", "content": { ... } },
       { "id": "fit", "title": "Fit Analysis", "content": { ... } },
       { "id": "knowledge", "title": "Knowledge Map", "content": { ... } },
       { "id": "plan", "title": "Sprint Plan", "content": { ... } },
       { "id": "tactics", "title": "AI Tactics", "content": { ... } },
       { "id": "resources", "title": "Resources", "content": { ... } }
     ],
     "summary": {
       "fitAssessment": "one sentence",
       "biggestGap": "...",
       "strongestAngle": "...",
       "startToday": "..."
     }
   }
   Return ONLY the JSON. No markdown, no backticks, no preamble.
     `.trim();
   }
   ```

5. **Create the API route** (`src/app/api/generate/route.ts`):
   ```typescript
   import { anthropic } from "@/lib/anthropic";
   import { buildGenerationPrompt } from "@/lib/prompts";
   import { SKILL_PROMPT } from "@/lib/skill";

   export const maxDuration = 120; // Allow up to 2 minutes for research + generation

   export async function POST(req: Request) {
     const body = await req.json();
     const userPrompt = buildGenerationPrompt(body);

     const stream = await anthropic.messages.stream({
       model: "claude-sonnet-4-6",
       max_tokens: 16000,
       system: SKILL_PROMPT,
       messages: [{ role: "user", content: userPrompt }],
     });

     // Return a streaming response
     const encoder = new TextEncoder();
     const readable = new ReadableStream({
       async start(controller) {
         for await (const event of stream) {
           if (
             event.type === "content_block_delta" &&
             event.delta.type === "text_delta"
           ) {
             controller.enqueue(encoder.encode(event.delta.text));
           }
         }
         controller.close();
       },
     });

     return new Response(readable, {
       headers: {
         "Content-Type": "text/plain; charset=utf-8",
         "Transfer-Encoding": "chunked",
       },
     });
   }
   ```

6. **Important: Enable web search in the API call.**
   The skill relies heavily on web search for company research. Add the web search tool to the API call:
   ```typescript
   const stream = await anthropic.messages.stream({
     model: "claude-sonnet-4-6",
     max_tokens: 16000,
     system: SKILL_PROMPT,
     messages: [{ role: "user", content: userPrompt }],
     tools: [{ type: "web_search_20250305", name: "web_search" }],
   });
   ```
   Note: With tool use and streaming, the response will include tool_use and tool_result blocks. You'll need to handle these in the stream processing — filter for text_delta events only when constructing the user-facing output. The web search happens server-side and the user just sees the final text stream.

7. **Test the API route locally:**
   ```bash
   npm run dev
   # In another terminal:
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"jobDescription":"Test PM role...","companyName":"TestCo","userBackground":"5 years PM experience"}'
   ```

### Verification
- API route returns streaming text
- Claude researches the company (web search tool is invoked)
- Response is valid JSON with all 7 sections
- Response completes within 2 minutes

---

## Phase 3: Generation UI (Day 3-4)

### Goal
Build the frontend form and real-time brief rendering experience.

### Steps

1. **Create the generation form** (`src/components/GenerateForm.tsx`):
   - Client component
   - Fields:
     - Job Description (large textarea, required)
     - Company Name (text input, required — auto-extract from job description if possible)
     - Your Background (large textarea, required — placeholder: "Paste your resume, LinkedIn summary, or describe your experience")
     - Timeline (select: 30 days / 60 days / 90 days, default 30)
     - Hours per day (select: 1-2 / 3-4 / 5-6, default 3-4)
     - Specific concerns (optional textarea)
   - Submit button: "Generate Intelligence Brief"
   - Loading state: show progress indicator during generation
   - Dark theme matching the existing brief aesthetic

2. **Create the streaming brief renderer** (`src/components/StreamingBrief.tsx`):
   - Receives the streaming response from the API
   - Accumulates text chunks into a growing string
   - Once the full JSON is received, parse it and render using the standard brief UI components
   - During streaming: show a "Researching..." / "Analyzing..." / "Building your brief..." progress indicator with animated steps
   - After completion: render the full interactive brief with tabs/sections

3. **Create the generate page** (`src/app/generate/page.tsx`):
   - Shows the form initially
   - On submit: calls `/api/generate` with the form data
   - Transitions to the streaming brief view
   - After completion: show a "Save Brief" button

4. **Build the brief renderer component** (`src/components/BriefRenderer.tsx`):
   - Takes the structured JSON from the API response
   - Renders it using the same visual language as the existing briefs (dark theme, amber/emerald/red/blue color coding, IBM Plex fonts, expandable sections)
   - Sections: tabs or accordion navigation
   - This replaces the need for each brief to be a separate `.jsx` file — one renderer, many briefs

5. **Add loading states and error handling:**
   - Network errors: show a retry button
   - API rate limits: show a "please wait" message
   - Malformed JSON response: show raw text with a "generation had an issue" message
   - Timeout: show partial results if available

6. **Wire up the landing page CTA:**
   - "Generate Your Brief" button → navigates to `/generate`

### Verification
- Form submits and streams a response
- Progress indicators show during generation
- Completed brief renders with all 7 sections
- Brief is interactive (tabs, expandable sections)
- Error states are handled gracefully

---

## Phase 4: Database + Saved Briefs (Day 5-6)

### Goal
Let users save generated briefs and come back to them. Use Supabase for database and auth.

### Steps

1. **Set up Supabase:**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```
   - Create a Supabase project at supabase.com (free tier)
   - Get your project URL and anon key
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

2. **Create the database schema** (run in Supabase SQL editor):
   ```sql
   -- Users get created automatically by Supabase Auth

   create table briefs (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) on delete cascade,
     created_at timestamptz default now(),
     job_description text not null,
     company_name text not null,
     role_title text,
     user_background text,
     timeline_days int default 30,
     brief_data jsonb not null,        -- the full generated brief JSON
     summary jsonb,                    -- the 4-line summary
     fit_percentage text,
     status text default 'generated',  -- generated, prepping, applied, interviewing
     priority int
   );

   -- Enable Row Level Security
   alter table briefs enable row level security;

   -- Users can only see their own briefs
   create policy "Users can read own briefs"
     on briefs for select using (auth.uid() = user_id);
   create policy "Users can insert own briefs"
     on briefs for insert with check (auth.uid() = user_id);
   create policy "Users can update own briefs"
     on briefs for update using (auth.uid() = user_id);
   create policy "Users can delete own briefs"
     on briefs for delete using (auth.uid() = user_id);
   ```

3. **Set up Supabase client** (`src/lib/supabase.ts`):
   - Create browser client for client components
   - Create server client for API routes and server components
   - Follow Supabase SSR pattern for Next.js App Router

4. **Add auth:**
   - Use Supabase Auth with email/password or magic link (simplest)
   - Create `src/app/login/page.tsx` with email + password form
   - Create `src/app/signup/page.tsx`
   - Add auth state to Nav component (show user email, logout button)
   - Protect `/generate` and `/dashboard` routes — redirect to login if not authenticated
   - Allow unauthenticated users to view the landing page and example briefs

5. **Save briefs after generation:**
   - After the streaming response completes and JSON is parsed:
   - Call a server action or API route to save the brief to Supabase
   - Return the brief ID so the URL can be updated to `/briefs/[id]`

6. **Load saved briefs:**
   - `/dashboard` fetches all briefs for the current user from Supabase
   - Replace the hardcoded ROLES array in the dashboard with real data
   - Each brief card links to `/briefs/[id]` which loads from the database

7. **Update brief status:**
   - Add status toggles on the dashboard (not-started → prepping → applied → interviewing)
   - Add priority reordering (drag-and-drop or manual number input)
   - These update the Supabase row in real time

### Verification
- User can sign up and log in
- Generated briefs are saved to the database
- Dashboard shows all saved briefs for the logged-in user
- Briefs persist across sessions
- Status and priority updates save correctly
- Users can only see their own briefs (RLS works)

---

## Phase 5: Polish + Launch (Day 7-10)

### Goal
Polish the UI, add a proper landing page, and prepare for public sharing.

### Steps

1. **Landing page polish:**
   - Hero: "Turn any job posting into a 30-day preparation plan"
   - Subheading: "AI-powered career intelligence. Paste a job description, get a personalized brief with gap analysis, learning sprint, and interview prep."
   - CTA: "Generate Your First Brief — Free"
   - Social proof section: show screenshots of generated briefs
   - How it works: 3 steps (paste job → AI researches → get your plan)
   - Example brief section: link to a pre-generated brief as a demo

2. **Generation experience polish:**
   - Add animated progress steps during generation:
     - "Researching company..." (with pulse animation)
     - "Analyzing job requirements..."
     - "Mapping your background..."
     - "Building sprint plan..."
     - "Finalizing brief..."
   - Time estimate: "This usually takes 60-90 seconds"
   - After completion: confetti or subtle celebration animation

3. **Brief viewer polish:**
   - Ensure all 7 sections render with the same quality as the handcrafted briefs
   - Print/export: add a "Download as PDF" button (use browser print or html2canvas)
   - Share: generate a shareable link (if user makes brief public)

4. **Dashboard polish:**
   - Real data from Supabase replaces hardcoded arrays
   - Add "Generate New Brief" button prominently
   - Add search/filter by company or role
   - Add comparison view for multiple saved briefs

5. **SEO + metadata:**
   - Add proper OpenGraph tags for social sharing
   - Add a `robots.txt` and `sitemap.xml`
   - Add structured data (JSON-LD) for the landing page

6. **Rate limiting:**
   - Add a rate limit to the `/api/generate` route (e.g., 5 briefs per user per day)
   - This prevents API cost runaway
   - Use Vercel's built-in rate limiting or a simple counter in Supabase

7. **Error monitoring:**
   - Add Sentry or similar for error tracking
   - Log failed API calls and malformed responses

8. **Deploy final version:**
   ```bash
   git add .
   git commit -m "Launch: Job Prep Intel v1.0"
   git push
   # Vercel auto-deploys from GitHub
   ```

9. **Set environment variables in Vercel dashboard:**
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Verification
- Landing page looks professional and loads fast
- Full generation flow works end-to-end (form → stream → rendered brief → saved)
- Dashboard shows real saved briefs
- Mobile responsive
- Errors are caught and logged
- Rate limiting prevents abuse

---

## Phase 6: Growth + Monetization (Future)

### Ideas for making this a real product

1. **Free tier:** 3 briefs per month. Enough to validate the product.

2. **Pro tier ($19/mo):** Unlimited briefs, priority generation, brief comparison tools, interview prep mode (Claude mock interviews based on the brief).

3. **Payment:** Stripe Checkout integrated with Supabase auth. Gate the `/api/generate` route based on subscription status.

4. **Sharing:** Let users share briefs publicly (with a toggle). Create a gallery of anonymized example briefs for SEO.

5. **Resume upload:** Accept PDF resume uploads. Use Claude to parse the resume and auto-populate the background field.

6. **Interview prep mode:** After generating a brief, offer a "Practice Interview" button that starts a Claude conversation using the brief as context. Claude plays the hiring manager.

7. **Job board integration:** Let users paste a URL from Greenhouse, Lever, or LinkedIn and auto-extract the job description.

8. **Team features:** Let hiring managers generate briefs for candidates they're evaluating (flip the perspective).

---

## Cost Estimates

| Component | Free Tier Limit | Cost at Scale |
|-----------|----------------|---------------|
| Vercel | 100GB bandwidth, 100hrs compute | Pro: $20/mo |
| Supabase | 500MB database, 50K auth users | Pro: $25/mo |
| Anthropic API (Sonnet 4.6) | N/A (pay per token) | ~$0.02/brief |
| Domain | N/A | ~$12/year |
| **Total (1000 briefs/mo)** | **~$0** | **~$65/mo** |

---

## Commands Summary

```bash
# Initial setup
npx create-next-app@latest job-prep-next --typescript --tailwind --app --src-dir
cd job-prep-next
npm install @anthropic-ai/sdk ai @supabase/supabase-js @supabase/ssr

# Development
npm run dev          # Start local server at http://localhost:3000

# Deployment
vercel               # Deploy to Vercel (first time — follow prompts)
vercel --prod        # Deploy to production

# Database
# Run SQL in Supabase dashboard SQL editor

# Environment variables
# Set in .env.local for local dev
# Set in Vercel dashboard for production
```

---

## Notes for Claude Code

- Use Next.js 15 App Router patterns throughout (not Pages Router)
- All brief components need `"use client"` at the top since they use React hooks
- The API route at `/api/generate/route.ts` is a server-side Route Handler
- Use TypeScript strict mode — no `any` types
- Follow the existing design language: dark theme, IBM Plex / DM Sans / JetBrains Mono fonts, amber/emerald/red/blue color coding
- The streaming response handling is the trickiest part — test thoroughly
- Keep the SKILL.md system prompt under the model's context limit (it's ~4K tokens, well within bounds)
- The Anthropic SDK's `.stream()` method returns an async iterator — use `for await` to process chunks
