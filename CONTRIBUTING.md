# Contributing to Job Prep Intel

Thanks for your interest in contributing! This project is open source and welcomes contributions from anyone who wants to help people prepare for career moves using AI.

## Ways to Contribute

### Use it and share feedback
The simplest contribution is using the skill, generating briefs, and telling us what worked and what didn't. Open an issue with your feedback.

### Improve the skill (SKILL.md)
The intelligence brief skill is the core of this project. If you have ideas for better prompts, additional sections, improved research steps, or calibration improvements, submit a PR editing `SKILL.md`.

### Add brief templates
If you've generated briefs for roles in industries we haven't covered (healthcare, law, finance, education, etc.) and want to share anonymized examples, we'd love to include them as references.

### Improve the dashboard
The dashboard (`job-prep-dashboard.jsx`) could always be better. Ideas: better comparison views, Gantt-style timeline views, export to PDF, integration with job boards.

### Build the SaaS product
We're building a web app version (Next.js + Vercel + Supabase) where anyone can generate briefs. See `IMPLEMENTATION_PLAN.md` for the full roadmap. PRs welcome for any phase.

## How to Submit Changes

1. Fork the repo
2. Create a branch (`git checkout -b improve-skill-research`)
3. Make your changes
4. Test by uploading modified files to a Claude conversation and generating a brief
5. Commit with a clear message (`git commit -m "Add salary negotiation section to skill"`)
6. Push and open a Pull Request

## Guidelines

- Keep the SKILL.md under 500 lines — Claude's context window matters
- Brief artifacts should be self-contained single-file React components
- Follow the existing dark theme and color language (amber/emerald/red/blue)
- Be honest in gap analyses — the project's value is in accuracy, not flattery
- Test changes by actually generating briefs with the modified skill

## Code of Conduct

Be kind. This project helps people with career transitions, which can be stressful. Keep feedback constructive and contributions welcoming.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
