# Pull-to-Refresh Feature

This document explains the pull-to-refresh functionality implemented across the application for enhanced mobile UX.

## Overview

Pull-to-refresh is a native mobile gesture that allows users to refresh content by pulling down on the screen. This feature has been implemented on game lists and community feeds to provide a familiar, intuitive way to get the latest data.

## Implementation

### Components

1. **`usePullToRefresh` Hook** (`src/hooks/usePullToRefresh.tsx`)
   - Detects pull-down gestures on touch devices
   - Manages pull state (distance, threshold, refreshing)
   - Triggers the refresh callback
   - Configurable threshold and resistance

2. **`PullToRefreshIndicator` Component** (`src/components/PullToRefreshIndicator.tsx`)
   - Visual feedback during pull gesture
   - Animated progress ring
   - Loading spinner during refresh
   - Status messages ("Pull to refresh", "Release to refresh")

### Pages with Pull-to-Refresh

#### 1. My Games (`src/pages/MyGames.tsx`)
Refreshes:
- Upcoming games
- Hosted games  
- Saved games
- User RSVPs

#### 2. Discover (`src/pages/Discover.tsx`)
Refreshes:
- All available games
- Game markers on map
- Game list

#### 3. Community (`src/pages/Community.tsx`)
Refreshes:
- Communities list (when in list view)
- Community posts and feed (when viewing a community)

## Usage

### For Users

1. **Scroll to the top** of the page
2. **Pull down** and hold
3. When you see "Release to refresh", **let go**
4. Content will refresh with a loading animation
5. Success message appears when complete

### For Developers

To add pull-to-refresh to a new page:

```tsx
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";

function MyPage() {
  const fetchData = async () => {
    // Your data fetching logic
  };

  const pullToRefreshState = usePullToRefresh({
    onRefresh: async () => {
      await fetchData();
      toast({ title: "Refreshed!", description: "Data updated" });
    },
    enabled: true, // Can be conditional
    threshold: 80, // Optional: distance needed to trigger (default: 80px)
    resistance: 2.5, // Optional: pull resistance (default: 2.5)
  });

  return (
    <div>
      <PullToRefreshIndicator {...pullToRefreshState} />
      {/* Your content */}
    </div>
  );
}
```

## Configuration Options

### `usePullToRefresh` Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onRefresh` | `() => Promise<void>` | Required | Async function to call when refreshing |
| `threshold` | `number` | `80` | Distance in pixels needed to trigger refresh |
| `resistance` | `number` | `2.5` | Controls how much resistance during pull |
| `enabled` | `boolean` | `true` | Whether pull-to-refresh is active |

## Features

### Visual Feedback

- **Progress Ring**: Shows how close you are to triggering refresh
- **Icon Animation**: Chevron rotates when threshold is reached
- **Smooth Transitions**: Fluid animations for natural feel
- **Loading State**: Spinner appears during refresh

### Smart Detection

- **Only on Touch Devices**: Automatically disabled on desktop
- **Top-of-Page Detection**: Only works when scrolled to top
- **Prevents Scroll Conflicts**: Doesn't interfere with normal scrolling

### Mobile Optimization

- **iOS Compatible**: Works on Safari and iOS devices
- **Android Compatible**: Works on Chrome and Android browsers
- **Samsung Optimized**: Tested on Samsung devices
- **Pull-to-Refresh Disabled**: Native browser pull-to-refresh is disabled to prevent conflicts

## Best Practices

### Do's

- ✅ Show a success message after refresh
- ✅ Keep refresh operations fast (< 2 seconds)
- ✅ Refresh all visible data
- ✅ Use on scrollable lists/feeds
- ✅ Enable only when user is authenticated (if relevant)

### Don'ts

- ❌ Don't use on pages with minimal content
- ❌ Don't forget to show loading state
- ❌ Don't make refresh callbacks too slow
- ❌ Don't enable if data rarely changes
- ❌ Don't use on forms or input-heavy pages

## Accessibility

- Works alongside keyboard navigation
- Visual feedback for all pull states
- Clear status messages
- Does not interfere with screen readers

## Performance

- Minimal JavaScript overhead
- Efficient touch event handling
- Debounced state updates
- Only active on touch devices
- Automatic cleanup on unmount

## Browser Support

Works on all modern mobile browsers:
- iOS Safari (12+)
- Chrome Mobile (Android 8+)
- Samsung Internet (Android 8+)
- Firefox Mobile
- Edge Mobile

## Troubleshooting

### Pull-to-refresh not working

1. Make sure you're at the top of the page
2. Verify you're on a touch device
3. Check that `enabled` prop is `true`
4. Ensure no scroll locks are active

### Conflicts with native pull-to-refresh

- The app disables native browser pull-to-refresh
- Check `overscroll-behavior-y: contain` in CSS
- Verify viewport meta tag includes proper settings

### Refresh callback not firing

1. Check async function completes properly
2. Verify no errors in console
3. Ensure threshold is reached (default 80px)
4. Check `onRefresh` prop is provided

## Future Enhancements

Potential improvements:
- Haptic feedback on supported devices
- Custom pull animations
- Refresh indicators for specific sections
- Sound effects (optional)
- Pull-up-to-load-more on long lists
