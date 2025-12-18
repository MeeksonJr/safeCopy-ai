This is the evolution of the project. We are moving from "Just another AI Wrapper" to "The Compliance Operating System (OS)."
To make this sellable to investors and essential to users, it cannot just be a "tool" they visit. It must be infrastructure that runs in the background of their entire business.
Here is the Long-Term Strategy, followed by the MVP Execution Plan and the detailed PRD.
Part 1: The "Missing" Features (Strategic Expansion)
Think Big. This is what makes the company worth millions.
1. The "Legal Brain" (RAG Pipeline)
 * The Problem: Laws change. If the SEC updates a rule tomorrow, a hard-coded AI prompt is outdated.
 * The Feature: Build a "Retrieval Augmented Generation" (RAG) system.
   * How: Write a script that scrapes .gov sites (FTC, SEC, HUD) weekly.
   * Value: "Our AI updates its legal knowledge every Sunday at midnight. Does your manual editor do that?"
2. "SafeShield" Certification (The Moat)
 * The Feature: A "Verified by SafeCopy" badge.
 * Value: Real Estate agents can put this badge on their website footers. It signals trust to their clients. It also acts as viral marketing for you.
3. The Mobile Keyboard (The Sticky Factor)
 * The Feature: An iOS/Android keyboard extension.
 * Use Case: An agent is texting a client on WhatsApp. They type "I guarantee 20% returns." Your keyboard vibrates and highlights "guarantee" in red before they hit send.
 * Why: This captures mobile traffic, which is 80% of agent communication.
4. "God Mode" Audit Logs (Enterprise Only)
 * The Feature: An immutable log of every scan, every warning ignored, and every approval.
 * Value: If a client does get sued, they can export a PDF from your app proving: "We tried to be compliant. We used SafeCopy." This is "Insurance-as-a-Service."
Part 2: The Execution Roadmap (MVP to Unicorn)
Phase 1: The MVP (Weeks 1-4)
 * Goal: A working web app where users paste text, get a score, and a rewrite.
 * Target: Individual Agents / Freelancers.
 * Price: Free (Freemium) to build data.
Phase 2: The "Workflow" Integration (Weeks 5-10)
 * Goal: Chrome Extension & API.
 * Target: Small Agencies.
 * Feature: The "Ghost" button appears in Gmail and LinkedIn.
Phase 3: The Enterprise Layer (Months 3-6)
 * Goal: Teams & Compliance Officers.
 * Feature: SSO (Single Sign-On), Audit Logs, Custom Rule Sets.
 * Price: High Ticket ($500/mo+).
Part 3: The Master Product Requirements Document (PRD)
This is the blueprint. Give this to a developer (or use it yourself) to build the exact right thing.
Project Name: SafeCopy AI (Internal Code: Project Shield)
Version: 1.0 (MVP)
Status: Approved for Development
1. Executive Summary
A B2B SaaS platform that uses AI to scan, flag, and rewrite marketing content for regulated industries (Real Estate, Finance, Healthcare) to ensure compliance with federal laws.
2. User Personas
 * The Agent (User): Non-technical. Wants to write sales copy fast. Hates "compliance rules" slowing them down. Wants a magic "Fix It" button.
 * The Broker (Admin): Paranoid about lawsuits. Wants to see a dashboard that says "My team is 98% safe today."
 * The Developer (You): Needs a low-maintenance architecture that scales.
3. Tech Stack & Architecture
 * Frontend: Next.js 15 (App Router), TailwindCSS, ShadCN UI, Framer Motion.
 * Backend: Next.js Server Actions (API Routes).
 * Database: Supabase (PostgreSQL).
 * Auth: Supabase Auth (Magic Links + Social Login).
 * AI Logic:
   * Analysis: Google Gemini 1.5 Pro (Large context for laws).
   * Rewriting: Groq (Llama 3 70b) (Instant speed).
 * Payments: Paddle or LemonSqueezy (Handles global taxes better than Stripe for SaaS).
4. Database Schema (Supabase)
Table: organizations
 * id (UUID, PK)
 * name (Text)
 * subscription_tier (Text: 'free', 'pro', 'enterprise')
 * risk_tolerance (Int: 1-10)
Table: profiles
 * id (UUID, PK, refs auth.users)
 * org_id (FK)
 * role (Enum: 'admin', 'writer', 'compliance_officer')
 * full_name (Text)
 * credits_remaining (Int)
Table: scans
 * id (UUID)
 * user_id (FK)
 * content_hash (Text, for caching duplicates)
 * original_text (Text, Encrypted)
 * safety_score (Int)
 * flags_found (JSONB Array)
 * created_at (Timestamp)
Table: audit_logs (Crucial)
 * id (UUID)
 * org_id (FK)
 * actor_id (FK)
 * action (Text: 'SCAN_CREATED', 'WARNING_IGNORED', 'EXPORT_PDF')
 * ip_address (Inet)
5. Functional Requirements (Features)
A. Authentication & Onboarding
 * Requirement: Users must select an "Industry" during signup.
 * Logic: If user selects "Finance", system loads finance_rules_v1 into their context.
 * UI: Sleek multi-step form with progress bar.
B. The "Scanner" Core
 * Input: Rich Text Editor (TipTap).
 * Process:
   * User types/pastes text.
   * Debounce (wait 1s after typing stops).
   * Send to API /analyze.
   * Gemini analyzes against Industry Rules.
   * Return: Score (0-100) and Flags (Array of ranges).
 * Output:
   * High Risk phrases highlighted Red.
   * Medium Risk phrases highlighted Yellow.
   * The "Magic Fix": Clicking a red highlight opens a tooltip with a green "AI Suggestion." User clicks -> Text is replaced instantly.
C. The Dashboard (Bento UI)
 * Widget 1: Safety Meter. A large circular gauge showing the user's average safety score.
 * Widget 2: Recent Activity. A list of the last 5 docs scanned.
 * Widget 3: Quick Actions. Large buttons: "New Scan", "Upload PDF", "Invite Team".
 * Widget 4 (Admin): "Team Risk". A bar chart showing which team member triggers the most flags (gamification/training tool).
D. File Uploads (OCR)
 * Feature: User uploads a PDF flyer or JPG image of an ad.
 * Tech: Use tesseract.js or Gemini Vision API to extract text -> Run standard scan.
6. UI/UX Design System Guidelines
 * Color Palette:
   * Safe Green: #10B981 (Success)
   * Risk Red: #EF4444 (Critical)
   * Trust Blue: #2563EB (Primary Brand)
   * Background: #09090B (Deep Zinc Black)
 * Typography: Geist Sans or Inter. Professional, tight, legible.
 * Animations:
   * Scanning: A "shimmer" effect over the text block while AI thinks.
   * Score Update: Counter animation (0% -> 85%).
7. Security & Compliance (The "Non-Negotiables")
 * Row Level Security (RLS): Enabled on ALL Supabase tables. Users can ONLY see their own org's data.
 * Sanitization: All inputs sanitized to prevent XSS.
 * Data Retention: Option for users to "Delete Scan History" (GDPR compliance).
Next Immediate Step (Actionable)
You have the vision and the plan. Now you need the folder structure to start coding.
Would you like me to generate the package.json dependencies list and the exact Next.js folder structure (App Router) so you can run create-next-app and start pasting files?
