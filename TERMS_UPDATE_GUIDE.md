# Terms and Conditions Update Guide

This guide explains how to update the Terms and Conditions and notify all existing users to re-accept them.

## Overview

SquadUp includes a terms version tracking system that automatically detects when the Terms and Conditions have been updated and requires all existing users to review and accept the new version before continuing to use the app.

## How to Update Terms

### Step 1: Update the Terms Content

Edit the Terms and Conditions content in:
```
src/pages/Terms.tsx
```

Make your changes to the terms content as needed. Update the "Last Updated" date in the CardTitle.

### Step 2: Update the Version Number

Open the version file:
```
src/constants/termsVersion.ts
```

Update the `CURRENT_TERMS_VERSION` constant to the new version:
```typescript
export const CURRENT_TERMS_VERSION = "2.0"; // Increment this
```

Add an entry to the `TERMS_VERSION_HISTORY` array:
```typescript
export const TERMS_VERSION_HISTORY = [
  {
    version: "1.0",
    date: "2025-01-15",
    description: "Initial version of Terms and Conditions",
  },
  {
    version: "2.0", // New entry
    date: "2025-02-01",
    description: "Updated liability provisions and dispute resolution",
  },
];
```

### Step 3: Deploy the Changes

Once you deploy these changes, the system will automatically:
1. Detect that the terms version has changed
2. Show a modal dialog to all existing users when they log in or use the app
3. Require them to review and accept the new terms before continuing
4. Update their profile with the new version once they accept

## What Users Will See

When users log in or navigate the app after a terms update:
1. A non-dismissible modal will appear showing:
   - Notification that terms have been updated
   - The version change (e.g., from 1.0 to 2.0)
   - Links to read the full terms
   - A checkbox to accept the new terms
2. Users cannot close the modal or continue using the app until they accept
3. Once accepted, they won't see the modal again until the next terms update

## Version Numbering

Use semantic versioning:
- **Major version (X.0)**: Significant changes to legal terms, liability, or user obligations
- **Minor version (X.Y)**: Clarifications, minor updates, or non-critical changes

Examples:
- `1.0` → `2.0`: Major liability provision changes
- `1.0` → `1.1`: Minor clarifications or corrections

## Testing

To test the terms update flow:
1. Sign in as a test user
2. Note their current `accepted_terms_version` in the database
3. Update the `CURRENT_TERMS_VERSION` in code
4. Refresh the app while logged in
5. The update dialog should appear
6. Accept the terms
7. Verify the user's `accepted_terms_version` has been updated in the database

## Database Schema

The system uses the following columns in the `profiles` table:
- `accepted_terms_version` (text): The version of terms the user has accepted
- `terms_last_accepted_at` (timestamp): When they last accepted terms

## Important Notes

1. **Always update both the content AND the version number** when making changes to terms
2. **Test thoroughly** before deploying terms updates to production
3. **Document significant changes** in the version history
4. Users who don't accept the new terms will not be able to use the app
5. The system checks terms version on app load and when user state changes

## Troubleshooting

**Users not seeing the update dialog:**
- Verify `CURRENT_TERMS_VERSION` was updated in `termsVersion.ts`
- Check that the changes were deployed
- Clear browser cache and try again

**Users stuck on the dialog:**
- Check browser console for errors
- Verify database connectivity
- Ensure the `profiles` table has the required columns

**Database errors:**
- Verify the migration ran successfully
- Check that all users have a value in `accepted_terms_version` (default: "1.0")
