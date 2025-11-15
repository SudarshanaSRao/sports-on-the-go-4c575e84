import { RefreshCw, ChevronDown } from "lucide-react";

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
  threshold?: number;
}

export function PullToRefreshIndicator({
  isPulling,
  isRefreshing,
  pullDistance,
  canRefresh,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const opacity = Math.min(pullDistance / 40, 1);
  const scale = Math.min(pullDistance / 60, 1);

  if (!isPulling && !isRefreshing) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        transform: `translateY(${isRefreshing ? '0' : `-${100 - pullDistance}%`})`,
        transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      <div
        className="bg-background/95 backdrop-blur-sm rounded-full shadow-lg p-3 sm:p-4 border-2 border-primary/20 mt-4"
        style={{
          opacity: isRefreshing ? 1 : opacity,
          transform: `scale(${isRefreshing ? 1 : scale})`,
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      >
        {isRefreshing ? (
          <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-primary animate-spin" />
        ) : (
          <div className="relative">
            <ChevronDown
              className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-all duration-200"
              style={{
                transform: canRefresh ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
            {/* Progress ring */}
            <svg
              className="absolute -inset-2 w-10 h-10 sm:w-11 sm:h-11 -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary transition-all duration-200"
                strokeDasharray={`${progress * 2.827} 282.7`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Status text */}
      {!isRefreshing && (
        <div
          className="absolute top-16 sm:top-20 text-sm sm:text-base font-medium text-primary/80"
          style={{
            opacity: opacity * 0.8,
          }}
        >
          {canRefresh ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}
    </div>
  );
}
