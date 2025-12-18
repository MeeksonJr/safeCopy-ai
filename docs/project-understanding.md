# Project Understanding: SafeCopy AI - The Compliance Operating System

## 1. Project Concept and Vision

SafeCopy AI is evolving from a simple AI wrapper to "The Compliance Operating System (OS)." The core vision is to build a B2B SaaS platform that acts as an essential infrastructure for businesses in regulated industries (Real Estate, Finance, Healthcare) to ensure compliance with federal laws. It's not just a tool, but a background system that proactively helps businesses avoid legal issues and build trust.

### Key Differentiators:
*   **Proactive Compliance:** Moves beyond reactive error correction to preventative measures.
*   **Infrastructure, not just a tool:** Aims to be integrated into daily workflows, not just an an occasional visit.
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
*   **Payments:** PayPal (for global tax handling).

## 6. Database Schema (Supabase)

The database consists of the following tables with RLS enabled:

*   **`organizations`**: `id` (UUID, PK), `name` (Text), `subscription_tier` (Text: 'free', 'pro', 'enterprise'), `paypal_customer_id` (Text, UNIQUE), `paypal_subscription_id` (Text, UNIQUE), `subscription_status` (Text)
*   **`profiles`**: `id` (UUID, PK, refs auth.users), `org_id` (FK), `role` (Enum: 'admin', 'writer', 'compliance_officer'), `full_name` (Text)
*   **`scans`**: `id` (UUID), `user_id` (FK), `content_hash` (Text), `original_text` (Text, Encrypted), `safety_score` (Int), `flags_found` (JSONB Array), `suggestions` (JSONB Array), `rewritten_content` (Text), `industry` (Text), `content_type` (Text), `status` (Text), `created_at` (Timestamp), `updated_at` (Timestamp), `current_version_id` (UUID, FK)
*   **`audit_logs`**: `id` (UUID), `org_id` (FK), `actor_id` (FK), `action` (Text), `details` (JSONB), `ip_address` (Inet), `created_at` (Timestamp)
*   **`teams`**: `id` (UUID), `name` (Text), `owner_id` (UUID, FK), `plan` (Text), `scan_count` (Integer), `scan_limit` (Integer), `credits_remaining` (Integer), `monthly_credits` (Integer), `credits_used` (Integer), `created_at` (Timestamp), `updated_at` (Timestamp), `organization_id` (UUID, FK)
*   **`templates`**: `id` (UUID), `team_id` (UUID, FK), `user_id` (UUID, FK), `title` (Text), `content` (Text), `industry` (Text), `category` (Text), `safety_score` (Integer), `is_approved` (Boolean), `created_at` (Timestamp), `updated_at` (Timestamp)
*   **`scan_versions`**: `id` (UUID), `scan_id` (UUID, FK), `version_number` (Integer), `original_text` (Text), `rewritten_content` (Text), `created_at` (Timestamp)
*   **`team_invites`**: `id` (UUID), `team_id` (UUID, FK), `email` (Text), `invited_by_user_id` (UUID, FK), `role` (Text), `status` (Text), `created_at` (Timestamp), `updated_at` (Timestamp)
*   **`legal_documents`**: `id` (UUID), `source_url` (Text), `content` (Text), `embedding` (VECTOR(768)), `created_at` (Timestamp)

## 7. Functional Requirements (Features)

### A. Authentication & Onboarding
*   Users select an "Industry" during signup.
*   System loads industry-specific rules based on selection.
*   Sleek multi-step form with progress bar.
*   Email verification handled.
*   Onboarding wizard implemented.

### B. The "Scanner" Core
*   Input: Rich Text Editor (TipTap).
*   Process: Instant input -> API `/analyze` (Gemini analyzes against Industry Rules) -> Returns Score (0-100) and Flags (Array of ranges).
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
    *   **"God Mode" Audit Logs (Enterprise Only):** Functionality for exporting audit logs to PDF (now using Puppeteer for actual PDF generation) is integrated, allowing proof of compliance efforts.
*   **Team Management:**
    *   Team creation is fully functional.
    *   Team member invitation flow is implemented, utilizing a new `team_invites` table.
    *   Role management (admin, writer, compliance_officer) for existing team members is implemented.
    *   The `UserRole` type in `lib/types/database.ts` has been updated to reflect all available roles.
*   **Subscription Management (PayPal):** Full integration with PayPal for handling subscriptions (created, updated, canceled) and synchronizing with the `organizations` table. Paddle webhook route removed and `paypal_customer_id`, `paypal_subscription_id`, and `subscription_status` columns added to `organizations` table.
*   **Usage-Based Billing (Credits System):** Backend logic to decrement credits on scan completion and frontend display of credit usage are implemented.
*   **Enhanced Dashboard Widgets:** New interactive charts for compliance trends over time, content type distribution, and most common flags are implemented and integrated into the dashboard.
*   **Advanced AI Prompt Engineering:** Implemented a UI in settings for admins/compliance officers to input custom AI instructions and select additional rule sets, which are applied during AI analysis.
*   **Full RAG Pipeline Integration (The "Legal Brain"):** The full RAG system, including scraping, data processing, vector database integration, and API for real-time retrieval by Gemini, is now integrated. `analyzeScan` leverages RAG for dynamic compliance knowledge.
*   **"SafeShield" Certification UI:** The UI for displaying and managing the "Verified by SafeCopy" badge for agents, including embeddable code snippets, and backend logic for verifying certification status, is implemented.
*   **Real-time Feedback in Editor (Beyond Debounce):** The editor now provides instant compliance feedback as users type, removing the previous debounce delay.
*   **Version History for Scans:** Database schema updated with `scan_versions` table and `current_version_id` in `scans` table. `saveScan` action modified to manage versions. A new server action (`app/actions/scan-versions.ts`) has been created to fetch all versions associated with a given `scan_id`. The UI for viewing and restoring versions has been developed, including fetching scan versions and providing an interface to apply previous versions to the current editor content.
*   **Chrome Extension & API:** The basic Chrome extension structure (`extension/manifest.json`, `extension/src/background.ts`, `extension/src/content.ts`, `extension/src/popup.html`, `extension/src/popup.js`) is in place. The extension now dynamically injects an "Analyze with SafeCopy AI" button when text is selected, sends the selected text to a new API endpoint (`app/api/extension/analyze/route.ts`) for analysis, and displays the results (safety score, risk level, flagged issues) directly on the page.
*   **Direct File Uploads (OCR Enhancement):** File upload input and a dedicated button have been integrated into the `ComplianceScanner` component. A new server action (`app/actions/ocr.ts`) has been created to handle file uploads and perform OCR. The `rag_pipeline/requirements.txt` file has been updated to include `pytesseract` and `Pillow`, and a new Python script `rag_pipeline/ocr_processor.py` has been created to handle OCR processing. The `handleFileUpload` function in `ComplianceScanner` now reads the selected file, converts it to Base64, and sends it to the OCR action, which executes the Python script and populates the scanner's content with the extracted text.

### Database Schema Updates:
*   `credits_remaining` has been correctly moved to the `teams` table.
*   A new `team_invites` table has been created to manage pending team invitations.
*   PayPal-related columns (`paypal_customer_id`, `paypal_subscription_id`, `subscription_status`) have been added to the `organizations` table, replacing Paddle-specific columns.
*   AI compliance settings columns (`custom_ai_instructions`, `custom_rule_sets`) have been added to the `organizations` table.
*   `organization_id` has been added to the `teams` table.
*   `safeshield_certified` and `safeshield_badge_code` columns have been added to the `organizations` table.
*   A `legal_documents` table with a `vector` column has been created, and the `vector` extension enabled for RAG.
*   A new `scan_versions` table has been created to store historical versions of scanned content and its rewritten suggestions.
*   The `scans` table now includes a `current_version_id` column, referencing the latest version in the `scan_versions` table.

### Remaining Tasks from Initial Plan (All Completed):
*   All tasks from Phase 1, Phase 2, Phase 4.1, and Phase 4.2 of the previous plan are now completed.
*   The SQL migration for `team_invites` table creation (`scripts/008_create_team_invites_table.sql`) is completed.
*   The SQL migration for `scan_versions` table creation (`scripts/015_create_scan_versions_table.sql`) is completed.
*   The SQL migration for adding `current_version_id` to `scans` table (`scripts/016_add_current_version_id_to_scans.sql`) is completed.
*   The SQL migration for migrating from Paddle to PayPal (`scripts/017_migrate_from_paddle_to_paypal.sql`) is completed.

---

## 11. Brainstorming: Future Ideas & Enhancements

This section outlines potential future features, UI/UX improvements, and business model considerations to further enhance SafeCopy AI and its value proposition.

### A. Core Product Enhancements

1.  **Full RAG Pipeline Integration (The "Legal Brain"):**
    *   **Description:** Move beyond static rule sets. Implement the full RAG system as described in the long-term strategy (scraping .gov sites weekly).
    *   **Impact:** AI-driven compliance that dynamically updates, offering a significant competitive advantage.
    *   **Technical:** Requires robust scraping, data processing (embedding generation), vector database integration, and API for real-time retrieval by Gemini.

2.  **Real-time Feedback in Editor (Beyond Debounce):**
    *   **Description:** Integrate AI analysis directly into the rich text editor for instant feedback as the user types, rather than a 1-second debounce.
    *   **Impact:** Smoother, more intuitive user experience; immediate correction.
    *   **Technical:** Requires highly optimized, low-latency AI inference (e.g., local models or extremely fast cloud endpoints).

3.  **Version History for Scans:**
    *   **Description:** Allow users to view and revert to previous versions of scanned content and its rewritten suggestions.
    *   **Impact:** Enhanced auditability, content recovery, and compliance tracking over time.
    *   **Technical:** Database schema updated with `scan_versions` table and `current_version_id` in `scans` table. `saveScan` action modified to manage versions. A new server action (`app/actions/scan-versions.ts`) has been created to fetch all versions associated with a given `scan_id`. The UI for viewing and restoring versions has been developed, including fetching scan versions and providing an interface to apply previous versions to the current editor content.

4.  **Multi-language Support:**
    *   **Description:** Extend the scanner and templates to support multiple languages for global operations.
    *   **Impact:** Expands market reach.

### B. UI/UX & Integrations

1.  **"SafeShield" Certification Implementation:**
    *   **Description:** Develop the UI for displaying and managing the "Verified by SafeCopy" badge for agents, including embeddable code snippets.
    *   **Impact:** Viral marketing and trust-building for real estate agents.

2.  **Chrome Extension & API (Phase 2 from original roadmap):**
    *   **Description:** Implement the "Ghost" button that appears in third-party applications (Gmail, LinkedIn, CRM) for seamless scanning and rewriting.
    *   **Status:** Completed.
    *   **Impact:** Deep integration into user workflows, increased stickiness.
    *   **Technical:** Robust content script interaction, messaging between content scripts and background script, and a dedicated API endpoint for analysis. The "Ghost" button is now dynamic, appearing on text selection, and directly sends content to the SafeCopy AI backend for analysis and rewriting without opening a new tab, with results displayed directly on the page.

3.  **Mobile Keyboard Extension (Phase 3):**
    *   **Description:** Develop the iOS/Android keyboard extension that provides real-time compliance feedback during mobile communication.
    *   **Impact:** Captures critical mobile communication, preventative compliance.

4.  **Direct File Uploads (OCR Enhancement):**
    *   **Description:** Improve the robustness and accuracy of PDF/image text extraction using Gemini Vision API or fine-tuned `tesseract.js` configurations.
    *   **Status:** Completed. File upload input and a dedicated button have been integrated into the `ComplianceScanner` component. A new server action (`app/actions/ocr.ts`) has been created to handle file uploads and perform OCR. The `rag_pipeline/requirements.txt` file has been updated to include `pytesseract` and `Pillow`, and a new Python script `rag_pipeline/ocr_processor.py` has been created to handle OCR processing. The `handleFileUpload` function in `ComplianceScanner` now reads the selected file, converts it to Base64, and sends it to the OCR action, which executes the Python script and populates the scanner's content with the extracted text.
    *   **Impact:** Broader applicability for various content types.
    *   **Technical:** The OCR implementation is complete. The Python script `rag_pipeline/ocr_processor.py` is now integrated via Node.js's `child_process` in `app/actions/ocr.ts`. Further enhancements would focus on refining the OCR accuracy and potentially integrating advanced OCR services.

5.  **Advanced User Permissions/Roles:**
    *   **Description:** Granular control over permissions within a team, beyond just basic roles (e.g., restrict certain users from editing templates, or only allow certain roles to export audit logs).
    *   **Impact:** Enterprise-grade security and control.

### C. Business Model & Management Features

1.  **Single Sign-On (SSO) (Enterprise Only):**
    *   **Description:** Allow enterprise clients to integrate with their existing identity providers (e.g., Okta, Azure AD).
    *   **Impact:** Critical for enterprise adoption, streamlines user management.
    *   **Architectural and Implementation Plan:**
        1.  **Architectural Overview:** The integration will leverage Supabase's built-in support for enterprise Single Sign-On (SSO) using the OpenID Connect (OIDC) or SAML 2.0 protocols. The general flow will be: 1. User attempts to log in to SafeCopy AI. 2. User is redirected to their organization's Identity Provider (IdP) (Okta or Azure AD). 3. User authenticates with the IdP. 4. IdP redirects the user back to Supabase (via a callback URL), providing an authentication assertion. 5. Supabase processes the assertion, creates/updates the user in `auth.users`, and issues a session token. 6. Supabase redirects the user back to the SafeCopy AI application with the session token.
        2.  **Supabase Configuration (Admin Panel):** The primary configuration for SSO will happen within the Supabase project dashboard, typically under "Authentication" -> "Settings" or "Providers." This involves choosing the provider (OpenID Connect or SAML 2.0), providing client/app IDs, secrets, issuer/metadata URLs, and configuring callback URLs (redirect URIs) in both Supabase and the IdP. Attribute mapping from the IdP to Supabase user metadata is crucial.
        3.  **Application Changes (Frontend):** Adapt the login flow in `app/auth/login/page.tsx` by adding specific "Sign in with Okta/Azure AD" buttons. These buttons will initiate SSO by calling `supabase.auth.signInWithSSO` (or equivalent method) to redirect the user to the IdP. The existing `app/auth/callback/route.ts` should handle the post-IdP redirect and session exchange.
        4.  **Application Changes (Backend - Optional, for Advanced Scenarios):** For automatic user provisioning or advanced profile synchronization, configure webhooks in Okta/Azure AD to notify the SafeCopy AI backend about user lifecycle events. Role mapping from IdP roles to Supabase user metadata can be used for granular permissions.
        5.  **Environment Variables:** No new environment variables are strictly needed on the Next.js side for basic SSO integration, as the configuration is primarily handled within the Supabase dashboard. However, if using the `signInWithSSO` method and requiring a `provider` ID, this could be stored in `.env.local`.
        6.  **Development Steps:** 1. Configure Supabase for SSO in the project dashboard. 2. Update `app/auth/login/page.tsx` with SSO buttons and logic. 3. Thoroughly test the SSO flow.

2.  **Admin Panel for Superusers:**
    *   **Description:** A dedicated internal tool for SafeCopy administrators to manage users, teams, subscriptions, and monitor system health.
    *   **Impact:** Operational efficiency and support.
    *   **Architectural and Key Features Plan:**
        1.  **Purpose and Scope:** The Admin Panel will be an internal tool for managing platform operations, monitoring system health, and supporting users/organizations. It will enable administrators to oversee user accounts, manage organizations/teams, monitor subscriptions/usage, access audit logs, and manage system configurations.
        2.  **User Roles (within the Admin Panel):** Different levels of administrative access will exist, such as Super Administrator (full access), Support Agent (limited user/organization data access), and Billing Administrator (subscription/usage data access).
        3.  **Key Modules and Features:** This includes a Dashboard Overview (system health, key statistics), User Management (list, details, edit, reset password, impersonate, deactivate/delete), Organization & Team Management (list, details, edit organization settings, manage team memberships/credits, approve/revoke SafeShield), Subscription & Billing (overview, payment history, usage reports, actions like adjusting plans/credits/refunds), Enhanced Audit Logs (centralized view, advanced filtering, search, export), and System Configuration (global rule sets, template categories/industries, RAG pipeline monitoring).
        4.  **Technology Considerations:** Frontend will reuse Next.js, TailwindCSS, ShadCN UI. Backend will extend Next.js Server Actions, utilize Supabase Admin Client, and integrate with PayPal APIs and monitoring tools. Supabase PostgreSQL will be the database. Authentication will be dedicated for admins with strict session management.
        5.  **Security and Access Control:** Implement strong authentication (MFA), granular authorization based on admin roles, meticulous audit logging for all admin actions, rate limiting, and IP whitelisting. Prioritize safe server actions and limit direct database modifications.
        6.  **Integration Points:** Supabase API for user/organization/team/auth management, PayPal API for billing, and logging/monitoring services for system health.

### D. Security & Infrastructure

1.  **Enhanced Data Encryption:**
    *   **Description:** Implement more stringent encryption for `original_text` and `rewritten_content` in the `scans` table, possibly using Supabase's encryption capabilities or a separate encryption service.
    *   **Impact:** Higher security and data privacy.
    *   **Architectural and Implementation Plan (pgcrypto):**
        1.  **Recommendation:** Implement PostgreSQL `pgcrypto` symmetric encryption for `original_text` and `rewritten_content` columns in the `scans` table. This provides an additional layer of data-at-rest encryption while allowing the backend (Next.js Server Actions) to encrypt/decrypt the content for AI analysis and other functionalities.
        2.  **Implementation Steps:**
            *   **Enable `pgcrypto` Extension:** Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to a new SQL migration file (e.g., `scripts/018_enable_pgcrypto_extension.sql`).
            *   **Update `scans` Table Schema:** Create another SQL migration file (e.g., `scripts/019_encrypt_scan_content.sql`) to alter `original_text` and `rewritten_content` columns from `TEXT` to `BYTEA`. This will require careful data migration if existing data is present.
            *   **Secure Key Management:** Add a new environment variable `SCAN_ENCRYPTION_KEY` to `.env.local` (e.g., `SCAN_ENCRYPTION_KEY=your_strong_random_key`). This key must be strong and kept secret.
            *   **Modify `save-scan.ts` (Encryption):** In `app/actions/save-scan.ts`, encrypt content using `pgp_sym_encrypt(content, process.env.SCAN_ENCRYPTION_KEY)` before insertion/update.
            *   **Modify `getScans` (Decryption):** In `app/actions/scans.ts` (and other retrieval actions), decrypt content using `pgp_sym_decrypt(encrypted_content, process.env.SCAN_ENCRYPTION_KEY)` after fetching.
            *   **Update `lib/types/database.ts`:** If necessary, update the `Scan` interface to reflect the `BYTEA` type for encrypted content, though string conversion will happen in actions.
            *   **Review AI Analysis:** Ensure `app/actions/analyze.ts` receives plaintext content by decrypting it when fetching for analysis.
