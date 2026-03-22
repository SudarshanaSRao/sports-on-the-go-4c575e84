

## Fix: Restore Mouse Wheel Scrolling (Full 3-Part Solution)

### Root Cause
`react-remove-scroll` (used internally by Radix UI Dialog/Sheet) adds a global wheel `preventDefault()` when any dialog is open. The `TermsUpdateDialog` is always mounted (even when `open={false}`), and HMR or timing issues can cause `react-remove-scroll` to leave stale scroll-lock listeners active, blocking wheel scrolling site-wide.

### Changes

**1. Conditional render of TermsUpdateDialog** — `src/components/TermsVersionChecker.tsx`
- Change line 149-155 from always-mounted `<TermsUpdateDialog>` to `{showTermsUpdate && <TermsUpdateDialog ... />}`
- Ensures full unmount → guaranteed `react-remove-scroll` cleanup

**2. Scroll lock cleanup hook** — `src/hooks/useScrollLockCleanup.ts` (new file)
- Runs every 2 seconds via `setInterval`
- If no `[data-state="open"]` dialog/sheet overlays exist in the DOM:
  - Removes `data-scroll-locked` attribute from `<html>`
  - Removes any `react-remove-scroll`-injected classes from `<body>` (classes matching `block-interactivity`)
  - Resets `overflow` on `<html>` and `<body>` if they were set to `hidden`
- Lightweight DOM attribute checks only

**3. Mount cleanup hook** — `src/App.tsx`
- Import and call `useScrollLockCleanup()` alongside `useMobileViewport()`

**4. CSS safety net** — `src/index.css`
- Add `overflow-y: auto !important;` to both `html` and `body` base styles
- This provides a last-resort guarantee that scroll is never permanently locked by injected inline styles

### Files
| File | Action |
|------|--------|
| `src/components/TermsVersionChecker.tsx` | Edit: conditional render |
| `src/hooks/useScrollLockCleanup.ts` | Create |
| `src/App.tsx` | Edit: add hook import/call |
| `src/index.css` | Edit: add overflow-y to html/body |

