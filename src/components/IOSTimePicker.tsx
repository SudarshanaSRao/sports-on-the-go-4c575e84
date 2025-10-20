import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface IOSTimePickerProps {
  value: { hour: string; minute: string; period: string };
  onChange: (value: { hour: string; minute: string; period: string }) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

export function IOSTimePicker({ value, onChange }: IOSTimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const periods = ["AM", "PM"];

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (ref.current) {
      ref.current.scrollTop = index * ITEM_HEIGHT;
    }
  };

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      const hourIndex = hours.indexOf(value.hour);
      const minuteIndex = minutes.indexOf(value.minute);
      const periodIndex = periods.indexOf(value.period);

      if (hourIndex !== -1) scrollToIndex(hourRef, hourIndex);
      if (minuteIndex !== -1) scrollToIndex(minuteRef, minuteIndex);
      if (periodIndex !== -1) scrollToIndex(periodRef, periodIndex);
    });
  }, []);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    items: string[],
    key: "hour" | "minute" | "period"
  ) => {
    if (!ref.current) return;

    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

    onChange({
      ...value,
      [key]: items[clampedIndex],
    });

    // Snap to nearest item
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTop = clampedIndex * ITEM_HEIGHT;
      }
    }, 50);
  };

  const WheelColumn = ({
    items,
    selectedValue,
    columnRef,
    onScroll,
  }: {
    items: string[];
    selectedValue: string;
    columnRef: React.RefObject<HTMLDivElement>;
    onScroll: () => void;
  }) => {
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    const handleScrollEvent = () => {
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        onScroll();
      }, 150);
    };

    return (
      <div className="relative h-[200px] overflow-hidden">
        {/* Selection indicator */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[40px] border-y-2 border-primary/20 bg-primary/5 pointer-events-none z-10"
          style={{ height: `${ITEM_HEIGHT}px` }}
        />

        {/* Fade overlays */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />

        {/* Scrollable column */}
        <div
          ref={columnRef}
          className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
          onScroll={handleScrollEvent}
          style={{
            paddingTop: `${ITEM_HEIGHT * 2}px`,
            paddingBottom: `${ITEM_HEIGHT * 2}px`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center snap-start transition-all duration-200",
                item === selectedValue
                  ? "text-foreground font-semibold text-lg"
                  : "text-muted-foreground text-base"
              )}
              style={{ height: `${ITEM_HEIGHT}px` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-2 bg-muted/30 rounded-lg p-4 border">
      <WheelColumn
        items={hours}
        selectedValue={value.hour}
        columnRef={hourRef}
        onScroll={() => handleScroll(hourRef, hours, "hour")}
      />
      <div className="text-2xl font-bold text-muted-foreground">:</div>
      <WheelColumn
        items={minutes}
        selectedValue={value.minute}
        columnRef={minuteRef}
        onScroll={() => handleScroll(minuteRef, minutes, "minute")}
      />
      <WheelColumn
        items={periods}
        selectedValue={value.period}
        columnRef={periodRef}
        onScroll={() => handleScroll(periodRef, periods, "period")}
      />
    </div>
  );
}
