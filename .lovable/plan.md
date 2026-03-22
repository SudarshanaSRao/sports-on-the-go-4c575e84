
Goal: restore native mouse-wheel scrolling across all pages without regressing dialogs, sheets, map interactions, or chatbot behavior.

What I found from the deep code sanity check
1) There is only one explicit wheel listener in the app, and it is global:
- src/hooks/useWheelScrollFix.ts adds document-level wheel listener and calls stopImmediatePropagation() for every wheel event.
- It is mounted globally in src/App.tsx, so it affects every route.

2) I did not find any other page-level wheel handlers or preventDefault-on-wheel logic in page components (Home, Discover, Community, Host Game, etc.).

3) Several UI overlay primitives (Dialog/Sheet/AlertDialog) use full-screen overlays with closed-state animations but do not defensively disable pointer-events in closed state classes. If a closed layer lingers during animation/presence timing, it can still intercept wheel on main content.

Likely root cause (combined)
- Primary: the global wheel “fix” is too aggressive and can interfere with normal page wheel behavior.
- Secondary hardening needed: closed overlay layers should be non-interactive to prevent transparent interception edge cases.

Implementation plan
Step 1 — Remove the risky global wheel interceptor
- Update src/App.tsx:
  - Remove import/use of useWheelScrollFix().
- Remove or retire src/hooks/useWheelScrollFix.ts so no global wheel propagation tampering remains.

Step 2 — Harden overlay primitives against invisible wheel interception
- Update:
  - src/components/ui/dialog.tsx
  - src/components/ui/sheet.tsx
  - src/components/ui/alert-dialog.tsx
- Add closed-state non-interactive classes to overlays/content where appropriate:
  - data-[state=closed]:pointer-events-none
  - (and keep existing fade/animate classes)
- This ensures any closed-but-still-mounted overlay cannot capture wheel input.

Step 3 — Verify chatbot is not creating an oversized hit area
- Re-check src/components/SportyChatBot.tsx fixed elements:
  - Confirm only the visible bubble/button/chat panel receives pointer events.
  - Ensure no accidental full-viewport interactive wrapper exists.

Step 4 — Route-by-route QA pass (desktop mouse wheel)
- Validate on: /, /discover, /community, /host-game, /my-games, /friends, /leaderboard, /settings.
- For each route:
  - Wheel scroll works with cursor over normal content (not chatbot).
  - Scrollbar drag still works.
  - Keyboard scroll unchanged.
- Modal/sheet QA:
  - Open/close dialogs and mobile sheet, then re-test page wheel immediately after close.
- Discover QA:
  - Ensure map interactions still behave correctly (wheel over map vs page context).

Step 5 — Regression guard (non-invasive)
- Add a short code comment near overlay primitives documenting why closed-state pointer-events are disabled (prevents wheel-capture regressions).
- Keep changes tightly scoped to scrolling/overlay primitives only.

Technical details
- No backend/database/auth changes.
- Files to change:
  - src/App.tsx
  - src/hooks/useWheelScrollFix.ts (remove/retire)
  - src/components/ui/dialog.tsx
  - src/components/ui/sheet.tsx
  - src/components/ui/alert-dialog.tsx
  - (only if needed after validation) src/components/SportyChatBot.tsx
