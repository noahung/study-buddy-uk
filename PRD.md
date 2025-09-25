Study Buddy App (React Native, iOS/Android)
1. Purpose of the App

The Study Buddy App is a professional learning companion for UK learners pursuing professional certification exams (not degree-level).

The app’s mission:

Provide AI-powered learning support through chat tutoring.

Deliver mock exams that simulate real test conditions.

Help learners memorise key points using flashcards.

Allow structured note-taking with AI summarisation.

Enable a freemium → premium upgrade path.

This is a mobile-only app (Android + iOS, built with React Native).

2. Target Users

Professionals preparing for finance, IT, law, compliance, health, and training certificates.

Students who need structured exam prep with mock tests and revision aids.

Working adults with limited time who want mobile, AI-assisted study tools.

3. Features & User Flow
3.1 Authentication & Onboarding

Splash Screen → Animated logo.

Onboarding Flow → Explains AI tutor, mock exams, freemium model.

Authentication: Google Sign-In, Apple ID, Email/Password.

3.2 Course Selection

Course Catalogue Screen

Browse categories.

Search + filter.

Course Dashboard

Course progress bar.

Access buttons: AI Chat, Mock Tests, Flashcards, Notes.

3.3 Study Tools

AI Chat (Tutor)

Conversational study support.

Free: 10 messages/day.

Premium: Unlimited.

Mock Tests

Menu: mini-test or full-length exam.

Exam Interface: timed, multiple-choice.

Results Screen: detailed score breakdown + AI recommendations.

Free: 3 attempts (10 questions each).

Premium: Unlimited full exams.

Flashcards

Deck selection per course.

Study with swipe gestures.

Smart AI-generated flashcards.

Free: Locked.

Premium: Unlimited access.

Notes

Add/edit/delete course notes.

Free: Manual only.

Premium: AI note summarisation.

3.4 Profile & Settings

Profile Overview → Name, email, subscription, course progress.

Settings → Dark/light mode, notifications, subscription management.

Sidebar Navigation → Profile, Courses, Settings, Help.

Footer Navigation → Home, Chat, Tests, Flashcards, Notes.

4. Monetisation Model

Free Plan

AI Chat → 10 messages/day

Mock Tests → 3 attempts, 10 Q each

Flashcards → locked

Notes → manual only

Premium Plan

Unlimited AI Chat

Unlimited full mock exams

Flashcards unlocked

AI-assisted notes

Smart progress analytics

5. UI/UX Guidelines

Based on Google Material Design 3 (M3) with Soft UI (neumorphism) styling.

Rounded corners, subtle drop shadows, micro-interactions.

Footer nav bar for main features.

Sidebar menu for profile/settings.

Smooth transitions between sections (React Native animations).

6. Technical Stack

Frontend: React Native (Android/iOS).

UI: Material Design 3 + Soft UI theme.

Backend: Firebase (Auth, Firestore, Cloud Storage, Hosting).

AI Layer: OpenAI API or fine-tuned model (for tutor + flashcards + summaries).

Payments: Google Play Billing + Apple In-App Purchases.

Version Control: GitHub (Copilot Sonnet for development).

Design Handoff: Figma → React Native components.

7. Course Catalogue (Initial Database)
{
  "categories": [
    {
      "name": "Finance & Banking",
      "courses": [
        "CeMAP – Certificate in Mortgage Advice and Practice",
        "DipFA – Diploma for Financial Advisers",
        "CFA – Chartered Financial Analyst",
        "ACCA – Association of Chartered Certified Accountants",
        "CIMA – Chartered Institute of Management Accountants",
        "IMC – Investment Management Certificate"
      ]
    },
    {
      "name": "Law & Compliance",
      "courses": [
        "CILEx – Chartered Institute of Legal Executives",
        "SQE – Solicitors Qualifying Exam",
        "CISI – Chartered Institute for Securities & Investment",
        "AML – Anti-Money Laundering Certificate"
      ]
    },
    {
      "name": "IT & Cybersecurity",
      "courses": [
        "CompTIA A+",
        "CompTIA Security+",
        "AWS Certified Solutions Architect",
        "Microsoft Azure Fundamentals",
        "Cisco CCNA",
        "Certified Ethical Hacker (CEH)"
      ]
    },
    {
      "name": "Health & Safety",
      "courses": [
        "NEBOSH General Certificate",
        "IOSH Managing Safely",
        "First Aid at Work",
        "Food Safety Level 3"
      ]
    },
    {
      "name": "Education & Training",
      "courses": [
        "PTLLS – Preparing to Teach in the Lifelong Learning Sector",
        "Level 3 Award in Education and Training",
        "Assessor Qualification (CAVA)"
      ]
    }
  ]
}

8. Future Enhancements

Leaderboards & peer comparisons.

Community Q&A forums.

Gamification (badges, streaks, rewards).

Multi-language support.

Download offline study packs.

✅ The app is now officially Study Buddy.
✅ Includes purpose, flows, freemium model, technical stack, and course database.
✅ Ready to feed into Copilot Sonnet + GitHub for development.