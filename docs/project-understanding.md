# Project Understanding: SafeCopy AI - The Compliance Operating System

## 1. Project Concept and Vision

SafeCopy AI is evolving from a simple AI wrapper to "The Compliance Operating System (OS)." The core vision is to build a B2B SaaS platform that acts as an essential infrastructure for businesses in regulated industries (Real Estate, Finance, Healthcare) to ensure compliance with federal laws. It's not just a tool, but a background system that proactively helps businesses avoid legal issues and build trust.

### Key Differentiators:
*   **Proactive Compliance:** Moves beyond reactive error correction to preventative measures.
*   **Infrastructure, not just a tool:** Aims to be integrated into daily workflows, not just an occasional visit.
*   **Insurance-as-a-Service:** Provides audit logs as proof of compliance efforts, offering a form of digital insurance against lawsuits.
*   **Scalability & Adaptability:** Designed to handle evolving legal landscapes through a RAG pipeline and cater to various user personas and organizational sizes.

## 2. Long-Term Strategy (Strategic Expansion - "Missing Features")

The long-term strategy focuses on building "million-dollar" features that provide significant value and create a competitive moat.

*   **The "Legal Brain" (RAG Pipeline):**
    *   **Problem:** Laws change frequently, making hard-coded AI prompts outdated.
    *   **Solution:** A Retrieval Augmented Generation (RAG) system that scrapes .gov sites (FTC, SEC, HUD) weekly to keep the AI's legal knowledge current.
    *   **Value Proposition:** "Our AI updates its legal knowledge every Sunday at midnight. Does your manual editor do that?"

*   **"SafeShield" Certification (The Moat):**
    *   **Feature:** A "Verified by SafeCopy" badge for real estate agents to display on their websites.
    *   **Value Proposition:** Signals trust to clients and acts as viral marketing for SafeCopy.

*   **The Mobile Keyboard (The Sticky Factor):**
    *   **Feature:** An iOS/Android keyboard extension.
    *   **Use Case:** Alerts agents in real-time (e.g., WhatsApp) if they type non-compliant phrases ("I guarantee 20% returns").
    *   **Strategic Importance:** Captures mobile traffic (80% of agent communication), increasing stickiness.

*   **"God Mode" Audit Logs (Enterprise Only):**
    *   **Feature:** An immutable log of every scan, warning ignored, and approval.
    *   **Value Proposition:** "Insurance-as-a-Service." Provides irrefutable evidence of compliance efforts in case of a lawsuit.

## 3. Execution Roadmap (MVP to Unicorn)

The project will be rolled out in phases, targeting different market segments.

*   **Phase 1: The MVP (Weeks 1-4)**
    *   **Goal:** A working web app for text pasting, scoring, and rewriting.
    *   **Target:** Individual Agents / Freelancers.
    *   **Pricing:** Free (Freemium) to build data.

*   **Phase 2: The "Workflow" Integration (Weeks 5-10)**
    *   **Goal:** Chrome Extension & API integration.
    *   **Target:** Small Agencies.
    *   **Feature:** "Ghost" button appears in Gmail and LinkedIn for seamless integration.

*   **Phase 3: The Enterprise Layer (Months 3-6)**
    *   **Goal:** Cater to Teams & Compliance Officers.
    *   **Features:** SSO, Audit Logs, Custom Rule Sets.
    *   **Pricing:** High Ticket ($500/mo+).

## 4. User Personas

*   **The Agent (User):** Non-technical, wants fast sales copy, dislikes compliance rules, seeks a "Fix It" button.
*   **The Broker (Admin):** Paranoid about lawsuits, wants a dashboard to monitor team safety ("My team is 98% safe today.").
*   **The Developer (You):** Requires a low-maintenance, scalable architecture.

## 5. Tech Stack & Architecture

*   **Frontend:** Next.js 15 (App Router), TailwindCSS, ShadCN UI, Framer Motion.
*   **Backend:** Next.js Server Actions (API Routes).
*   **Database:** Supabase (PostgreSQL), with Row Level Security (RLS) enabled on all tables.
*   **Auth:** Supabase Auth (Magic Links + Social Login).
*   **AI Logic:**
    *   **Analysis:** Google Gemini 1.5 Pro (Large context for laws).
    *   **Rewriting:** Groq (Llama 3 70b) (Instant speed).
*   **Payments:** Paddle or LemonSqueezy (for global tax handling).

## 6. Database Schema (Supabase)

The database consists of the following tables with RLS enabled:

*   **`organizations`**: `id` (UUID, PK), `name` (Text), `subscription_tier` (Text: 'free', 'pro', 'enterprise'), `risk_tolerance` (Int: 1-10)
*   **`profiles`**: `id` (UUID, PK, refs auth.users), `org_id` (FK), `role` (Enum: 'admin', 'writer', 'compliance_officer'), `full_name` (Text)
*   **`scans`**: `id` (UUID), `user_id` (FK), `content_hash` (Text), `original_text` (Text, Encrypted), `safety_score` (Int), `flags_found` (JSONB Array), `created_at` (Timestamp)
*   **`audit_logs`**: `id` (UUID), `org_id` (FK), `actor_id` (FK), `action` (Text: 'SCAN_CREATED', 'WARNING_IGNORED', 'EXPORT_PDF'), `ip_address` (Inet)
*   **`teams`**: (Implicit from the recent updates, likely linked to organizations and profiles, and now includes `credits_remaining`).
*   **`templates`**: (Implicit from the recent updates, not explicitly defined in `first-idea.md` but now implemented).

## 7. Functional Requirements (Features)

### A. Authentication & Onboarding
*   Users select an "Industry" during signup.
*   System loads industry-specific rules based on selection.
*   Sleek multi-step form with progress bar.
*   Email verification handled.
*   Onboarding wizard implemented.

### B. The "Scanner" Core
*   Input: Rich Text Editor (TipTap).
*   Process: Debounced input -> API `/analyze` (Gemini analyzes against Industry Rules) -> Returns Score (0-100) and Flags (Array of ranges).
*   Output:
    *   High-risk phrases highlighted Red.
    *   Medium-risk phrases highlighted Yellow.
    *   "Magic Fix": Tooltip with "AI Suggestion" for replacements on clicking highlights.

### C. The Dashboard (Bento UI)
*   Widget 1: Safety Meter (circular gauge for average safety score).
*   Widget 2: Recent Activity (last 5 docs scanned).
*   Widget 3: Quick Actions ("New Scan", "Upload PDF", "Invite Team").
*   Widget 4 (Admin): "Team Risk" (bar chart showing team member flags).
*   Correctly displays team credits.

### D. File Uploads (OCR)
*   Feature: User uploads PDF flyer or JPG image of an ad.
*   Tech: `tesseract.js` or Gemini Vision API to extract text for scanning.

## 8. UI/UX Design System Guidelines

*   **Color Palette:**
    *   Safe Green: `#10B981` (Success)
    *   Risk Red: `#EF4444` (Critical)
    *   Trust Blue: `#2563EB` (Primary Brand)
    *   Background: `#09090B` (Deep Zinc Black)
*   **Typography:** Geist Sans or Inter (Professional, tight, legible).
*   **Animations:**
    *   Scanning: "Shimmer" effect over text block.
    *   Score Update: Counter animation (0% -> 85%).

## 9. Security & Compliance ("Non-Negotiables")

*   **Row Level Security (RLS):** Enabled on ALL Supabase tables.
*   **Sanitization:** All inputs sanitized (XSS prevention).
*   **Data Retention:** Option for users to "Delete Scan History" (GDPR compliance).
*   **Admin Client for RLS Bypass:** Secure pattern using `SUPABASE_SERVICE_ROLE_KEY` for admin operations after user authentication.

## 10. Current Status and Next Steps

The project has made significant progress, with the following key features and improvements implemented:

### Implemented Features:
*   **Authentication & Onboarding:** Complete user authentication flow, email verification, and a multi-step onboarding wizard for new users.
*   **Core AI Scanner:** Functional, real-time AI-powered content analysis and rewriting using Google Gemini and Groq (Llama 3 70b).
*   **Templates Library System:** Full CRUD operations for templates are implemented on both the backend and frontend. Users can create, view, edit, and delete templates. The UI is integrated with ShadCN UI and TailwindCSS, including preset and custom templates.
*   **Scan History & Details Pages:** Comprehensive scan history is available with server-side filtering, searching, and pagination. Detailed views of individual scans are provided.
*   **Reports & Analytics (Audit Logs):**
    *   Server-side fetching, filtering, searching, and pagination of audit logs are implemented.
    *   **"God Mode" Audit Logs (Enterprise Only):** Functionality for exporting audit logs to PDF (currently an HTML placeholder) is integrated, allowing proof of compliance efforts.
*   **Team Management:**
    *   Team creation is fully functional.
    *   Team member invitation flow is implemented, utilizing a new `team_invites` table.
    *   Role management (admin, writer, compliance_officer) for existing team members is implemented.
    *   The `UserRole` type in `lib/types/database.ts` has been updated to reflect all available roles.

### Database Schema Updates:
*   `credits_remaining` has been correctly moved to the `teams` table.
*   A new `team_invites` table has been created to manage pending team invitations.

### Remaining Tasks from Initial Plan (Completed):
*   Review the `Templates` system to ensure full CRUD operations and intuitive UI/UX. (Completed)
*   Review `Scans History & Details` to confirm filtering, searching, and detailed view functionalities. (Completed)
*   Review `Reports & Analytics` to validate interactive charts and audit logs functionality. (Completed)
*   Team page needs member invites and role management. (Completed)
*   Audit logs viewer needs full implementation (now integrated into `TeamActivity` with enhanced features). (Completed)

---

## 11. Brainstorming: Future Ideas & Enhancements

This section outlines potential future features, UI/UX improvements, and business model considerations to further enhance SafeCopy AI and its value proposition.

### A. Core Product Enhancements

1.  **Full RAG Pipeline Integration (The "Legal Brain"):**
    *   **Description:** Move beyond static rule sets. Implement the full RAG system as described in the long-term strategy (scraping .gov sites weekly).
    *   **Impact:** AI-driven compliance that dynamically updates, offering a significant competitive advantage.
    *   **Technical:** Requires robust scraping, data processing (embedding generation), vector database integration, and API for real-time retrieval by Gemini.

2.  **Advanced AI Prompt Engineering:**
    *   **Description:** Allow enterprise clients to customize rule sets and prompt instructions for AI analysis, tailored to their specific internal policies or niche compliance needs.
    *   **Impact:** Higher flexibility and customization for large organizations.

3.  **Real-time Feedback in Editor (Beyond Debounce):**
    *   **Description:** Integrate AI analysis directly into the rich text editor for instant feedback as the user types, rather than a 1-second debounce.
    *   **Impact:** Smoother, more intuitive user experience; immediate correction.
    *   **Technical:** Requires highly optimized, low-latency AI inference (e.g., local models or extremely fast cloud endpoints).

4.  **Version History for Scans:**
    *   **Description:** Allow users to view and revert to previous versions of scanned content and its rewritten suggestions.
    *   **Impact:** Enhanced auditability, content recovery, and compliance tracking over time.

5.  **Multi-language Support:**
    *   **Description:** Extend the scanner and templates to support multiple languages for global operations.
    *   **Impact:** Expands market reach.

### B. UI/UX & Integrations

1.  **"SafeShield" Certification Implementation:**
    *   **Description:** Develop the UI for displaying and managing the "Verified by SafeCopy" badge for agents, including embeddable code snippets.
    *   **Impact:** Viral marketing and trust-building for real estate agents.

2.  **Chrome Extension & API (Phase 2):**
    *   **Description:** Implement the "Ghost" button that appears in third-party applications (Gmail, LinkedIn, CRM) for seamless scanning and rewriting.
    *   **Impact:** Deep integration into user workflows, increased stickiness.

3.  **Enhanced Dashboard Widgets:**
    *   **Description:** Add more interactive charts and data visualizations to the dashboard, e.g., compliance trends over time, breakdown by content type, most common flags.
    *   **Impact:** Deeper insights for brokers and compliance officers.

4.  **Mobile Keyboard Extension (Phase 3):**
    *   **Description:** Develop the iOS/Android keyboard extension that provides real-time compliance feedback during mobile communication.
    *   **Impact:** Captures critical mobile communication, preventative compliance.

5.  **Direct File Uploads (OCR Enhancement):**
    *   **Description:** Improve the robustness and accuracy of PDF/image text extraction using Gemini Vision API or fine-tuned `tesseract.js` configurations.
    *   **Impact:** Broader applicability for various content types.

6.  **Advanced User Permissions/Roles:**
    *   **Description:** Granular control over permissions within a team, beyond just basic roles (e.g., restrict certain users from editing templates, or only allow certain roles to export audit logs).
    *   **Impact:** Enterprise-grade security and control.

### C. Business Model & Management Features

1.  **Subscription Management with Paddle/LemonSqueezy:**
    *   **Description:** Full integration with a chosen payment provider for handling subscriptions, upgrades, downgrades, billing, and invoicing.
    *   **Impact:** Monetization and automated billing.
    *   **Technical:** Requires webhook handling, secure client-side payment flows, and synchronization with Supabase `organizations` table (`subscription_tier`, `credits_remaining`, etc.).

2.  **Usage-Based Billing (Credits):**
    *   **Description:** Implement a robust system for tracking and billing based on AI scan credits. Integrate with payment provider for automated top-ups or overage charges.
    *   **Impact:** Flexible pricing model, incentivizes efficient usage.

3.  **Single Sign-On (SSO) (Enterprise Only):**
    *   **Description:** Allow enterprise clients to integrate with their existing identity providers (e.g., Okta, Azure AD).
    *   **Impact:** Critical for enterprise adoption, streamlines user management.

4.  **Admin Panel for Superusers:**
    *   **Description:** A dedicated internal tool for SafeCopy administrators to manage users, teams, subscriptions, and monitor system health.
    *   **Impact:** Operational efficiency and support.

### D. Security & Infrastructure

1.  **Full PDF Generation Integration:**
    *   **Description:** Replace the HTML placeholder in `exportAuditLogsToPdf` with actual PDF generation using `puppeteer` or `pdf-lib` to produce fully compliant, styled PDF reports.
    *   **Impact:** Professional, verifiable compliance reports.

2.  **Enhanced Data Encryption:**
    *   **Description:** Implement more stringent encryption for `original_text` and `rewritten_content` in the `scans` table, possibly using Supabase's encryption capabilities or a separate encryption service.
    *   **Impact:** Higher security and data privacy.

---

## 12. Proposed Implementation Plan: Phase 4 (Next Steps)

Given the completion of Phase 1 and 2, the next logical steps involve moving forward with key strategic enhancements and monetization features.

### Phase 4.1: Monetization & Core Integrations (High Priority)

1.  **Implement Full PDF Generation for Audit Logs:**
    *   **Goal:** Replace the HTML placeholder with a robust PDF generation solution.
    *   **Action:** Integrate `puppeteer` (or a suitable alternative) on the backend to convert the generated HTML audit log into a downloadable PDF. Update frontend to handle PDF blob.
    *   **Dependencies:** Backend setup for PDF generation.

2.  **Integrate Subscription Management with Paddle/LemonSqueezy:**
    *   **Goal:** Enable users to subscribe to different plans and manage their subscriptions.
    *   **Actions:**
        *   Backend: Set up webhooks to handle subscription events (creation, renewal, cancellation, upgrades).
        *   Frontend: Develop UI for pricing plans, subscription checkout, and a user-friendly subscription management page within "Settings."
    *   **Dependencies:** Chosen payment provider account setup.

3.  **Implement Usage-Based Billing (Credits System):**
    *   **Goal:** Track and manage AI scan credits, integrating with the subscription model.
    *   **Actions:**
        *   Backend: Logic to decrement credits on scan completion, handle credit top-ups, and enforce limits based on subscription tier.
        *   Frontend: Display real-time credit usage and options to purchase more credits.
    *   **Dependencies:** Subscription management in place.

### Phase 4.2: Workflow & UI/UX Enhancements (Medium Priority)

1.  **Enhanced Dashboard Widgets:**
    *   **Goal:** Provide richer insights and data visualizations on the dashboard.
    *   **Actions:** Implement new interactive charts for compliance trends over time, breakdown by content type, and most common flags.
    *   **Dependencies:** Sufficient scan data for meaningful visualization.

2.  **Advanced AI Prompt Engineering (Initial Version):**
    *   **Goal:** Offer basic customization of AI rules for enterprise users.
    *   **Actions:** Develop a simple UI in "Settings" where admins can input custom instructions or select additional rule sets to apply during scanning.
    *   **Dependencies:** Backend API to store and apply custom rules.

### Phase 4.3: Strategic Expansion (Lower Priority / Future)

1.  **Full RAG Pipeline Integration (The "Legal Brain"):**
    *   **Goal:** Achieve dynamic, self-updating legal compliance knowledge.
    *   **Actions:** Implement the scraping script, data processing, and vector database integration. Update `analyzeScan` to leverage RAG.
    *   **Dependencies:** Dedicated infrastructure/services for data ingestion and vector search.

2.  **"SafeShield" Certification UI:**
    *   **Goal:** Enable agents to display their compliance badge.
    *   **Actions:** Design and implement the badge display and embed code generation in the frontend.

3.  **Chrome Extension & Mobile Keyboard:**
    *   **Goal:** Integrate SafeCopy AI directly into user workflows across platforms.
    *   **Actions:** These are separate development tracks requiring dedicated efforts for browser extension and mobile app development, respectively.
