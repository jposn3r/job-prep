# Job Prep Intelligence System

An AI-accelerated career preparation toolkit that transforms job postings into comprehensive intelligence briefs with personalized learning sprint plans.

Built by [Jake Posner](https://github.com/jposn3r) using Claude as an AI co-pilot.

## What This Is

Paste any job description into Claude with the `job-prep-intel` skill active, and it generates:

- **Company & domain research** — real-time web research on the company, team, and competitive landscape
- **Fit analysis** — honest gap assessment mapping your background against every requirement  
- **Knowledge map** — expandable topic areas with AI acceleration tips for each
- **30-90 day sprint plan** — daily tasks calibrated to your gap size, not vague "study X" items
- **AI tactics** — specific Claude prompts organized by learning mode (Tutor, Mock Interviewer, Code Companion, etc.)
- **Resources** — prioritized courses, docs, papers, and industry context

Each brief is a self-contained React artifact (`.jsx`) with a dark-themed, navigable interface.

The **dashboard** (`job-prep-dashboard.jsx`) is a command center that tracks all roles, projects, learning progress, and lets you compare opportunities side-by-side.

## Briefs Included

| File | Role | Company | Fit |
|------|------|---------|-----|
| `anthropic-consumer-pm-brief.jsx` | Product Manager, Consumer | Anthropic | 95% |
| `anthropic-claude-code-pm-brief.jsx` | PM, Claude Code | Anthropic | 88% |
| `anthropic-em-people-products-brief.jsx` | EM, People Products | Anthropic | 92% |
| `anthropic-ui-engineer-brief.jsx` | UI Software Engineer | Anthropic | 70% |
| `nvidia-av-plan.jsx` | Sr. Dir, AV Planning & Controls | NVIDIA | 55% |
| `nvidia-av-testing-brief.jsx` | Sr. EM, L3/L4 Testing | NVIDIA | 25% |
| `nvidia-dht-tpm-brief.jsx` | TPM, Digital Human Tech | NVIDIA | 78% |

## Quick Start

### Option 1: View in Claude (Easiest)

Upload any `.jsx` file into a Claude conversation. It renders as an interactive artifact immediately. No setup required.

### Option 2: Run Locally

```bash
# Clone the repo
git clone https://github.com/jposn3r/job-prep.git
cd job-prep

# Install dependencies
npm install

# Start the dev server
npm run dev

# Open http://localhost:5173
```

### Option 3: Use the Skill in Your Own Claude Project

1. Copy `SKILL.md` into a Claude Project as a knowledge file
2. Paste any job description into the conversation
3. Claude generates a full intelligence brief automatically

## How It Works

### The Skill (`SKILL.md`)

The skill instructs Claude to:

1. **Research** the company (4-6 web searches), domain (3-5 searches), and role archetype (2-3 searches)
2. **Decompose** the job description into hard skills, soft skills, domain experience, execution track record, and credentials
3. **Map** your background against each requirement (strong fit, adjacent fit, gap, stretch)
4. **Generate** a calibrated sprint plan (30 days for small gaps, 60-90 for large gaps)
5. **Output** an interactive React artifact with 7 navigable sections

### The Dashboard (`job-prep-dashboard.jsx`)

A centralized command center with 5 views:

- **Overview** — stats, priority stack, high-priority projects
- **Roles** — click-to-explore detail cards for each opportunity
- **Compare** — side-by-side table of top roles
- **Projects** — portfolio pieces linked to target roles
- **Learning** — modules with hours, progress, and role mapping

### Updating Progress

Edit the data arrays at the top of `job-prep-dashboard.jsx`:

```jsx
// Change status on any item:
{ id:"p1", name:"Streaming Chat Clone", status:"not-started", ... }
// becomes:
{ id:"p1", name:"Streaming Chat Clone", status:"in-progress", ... }
// or:
{ id:"p1", name:"Streaming Chat Clone", status:"complete", ... }
```

Valid statuses: `not-started`, `in-progress`, `complete`, `applied`, `interviewing`, `watching`

## For Other Users

### Using the Skill for Your Own Job Search

1. **Fork this repo** or just grab `SKILL.md`
2. **Add it to a Claude Project** as a knowledge file (or upload as a skill via Customize > Skills on web)
3. **Tell Claude about your background** — paste your resume or describe your experience in conversation
4. **Paste a job description** — Claude will research the company, analyze fit, and build a personalized sprint plan
5. **Save the output** — each brief is a standalone `.jsx` file you can add to your own repo

The skill works for any industry, role, or experience level. It auto-calibrates the sprint plan based on how big the gap is between your background and the role's requirements.

### Customizing the Skill

The skill is designed to be forked and modified. Common customizations:

- **Change the visual theme** — edit the "Artifact Design Requirements" section in `SKILL.md`
- **Add sections** — add new sections to the output template (e.g., "Salary Negotiation Strategy")
- **Change the sprint calibration** — adjust the gap thresholds and timeline defaults
- **Industry-specific prompts** — add domain-specific research steps for your industry

### Building Your Own Dashboard

Copy `job-prep-dashboard.jsx` and replace the data arrays with your own roles, projects, and learning modules. The component is self-contained — no external dependencies beyond React.

## Project Structure

```
job-prep/
├── index.html                              # Entry point for local dev
├── package.json                            # Dependencies and scripts
├── vite.config.js                          # Vite configuration
├── src/
│   └── main.jsx                            # App router
├── briefs/
│   ├── anthropic-consumer-pm-brief.jsx
│   ├── anthropic-claude-code-pm-brief.jsx
│   ├── anthropic-em-people-products-brief.jsx
│   ├── anthropic-ui-engineer-brief.jsx
│   ├── nvidia-av-plan.jsx
│   ├── nvidia-av-testing-brief.jsx
│   └── nvidia-dht-tpm-brief.jsx
├── job-prep-dashboard.jsx                  # Command center
├── SKILL.md                                # The intelligence brief skill
└── README.md
```

## Tech Stack

- **React** — UI components
- **Tailwind CSS** (via CDN) — utility styling
- **Vite** — local dev server and build
- **Claude** — research, analysis, and artifact generation
- **IBM Plex Sans / JetBrains Mono** — typography (loaded via Google Fonts)

## License

MIT — use this however you want. If you build something cool with it, let me know.

## Credits

Built during a single conversation with Claude (Opus 4.6), starting from a job posting analysis and evolving into a full career preparation system with a custom skill, 7 intelligence briefs, and a tracking dashboard.
