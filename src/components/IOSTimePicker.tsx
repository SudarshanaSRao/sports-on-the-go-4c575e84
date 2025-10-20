import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IOSTimePickerProps {
  value: string; // Format: "HH:mm" (24-hour)
  onChange: (value: string) => void;
}

const ITEM_HEIGHT = 44;

export function IOSTimePicker({ value, onChange }: IOSTimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const periods = ["AM", "PM"];

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  // Convert 24-hour format to 12-hour format
  const parse24Hour = (time24: string) => {
    if (!time24 || !time24.includes(":")) {
      return { hour: "12", minute: "00", period: "AM" };
    }

    const [hourStr, minuteStr] = time24.split(":");
    const hour24 = parseInt(hourStr, 10);
    const minute = minuteStr.padStart(2, "0");

    const period = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;

    return {
      hour: hour12.toString().padStart(2, "0"),
      minute,
      period,
    };
  };

  // Convert 12-hour format to 24-hour format
  const to24Hour = (hour12: string, minute: string, period: string) => {
    let hour24 = parseInt(hour12, 10);

    if (period === "AM") {
      if (hour24 === 12) hour24 = 0;
    } else {
      if (hour24 !== 12) hour24 += 12;
    }

    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };

  const currentValue = parse24Hour(value);

  const scrollToIndex = (ref: React.RefObject<HTMLDivElement>, index: number, smooth = false) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useEffect(() => {
    // Initial scroll position
    requestAnimationFrame(() => {
      const hourIndex = hours.indexOf(currentValue.hour);
      const minuteIndex = minutes.indexOf(currentValue.minute);
      const periodIndex = periods.indexOf(currentValue.period);

      if (hourIndex !== -1) scrollToIndex(hourRef, hourIndex);
      if (minuteIndex !== -1) scrollToIndex(minuteRef, minuteIndex);
      if (periodIndex !== -1) scrollToIndex(periodRef, periodIndex);
    });
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, items: string[], key: "hour" | "minute" | "period") => {
    if (!ref.current) return;

    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const selectedItem = items[clampedIndex];

    // Update the value
    const newValue = {
      ...currentValue,
      [key]: selectedItem,
    };

    // Convert to 24-hour format and call onChange
    const time24 = to24Hour(newValue.hour, newValue.minute, newValue.period);
    onChange(time24);

    // Snap to nearest item
    setTimeout(() => {
      if (ref.current) {
        scrollToIndex(ref, clampedIndex, true);
      }
    }, 100);
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        onScroll();
      }, 150);
    };

    return (
      <div className="relative h-[220px] overflow-hidden flex-1">
        {/* Selection indicator */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-y-2 border-blue-500/30 bg-blue-500/5 pointer-events-none z-10 rounded"
          style={{ height: `${ITEM_HEIGHT}px` }}
        />

        {/* Fade overlays */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />

        {/* Scrollable column */}
        <div
          ref={columnRef}
          className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory scroll-smooth"
          onScroll={handleScrollEvent}
          style={{
            paddingTop: `${ITEM_HEIGHT * 2}px`,
            paddingBottom: `${ITEM_HEIGHT * 2}px`,
          }}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-center snap-start transition-all duration-200 cursor-pointer select-none",
                  isSelected ? "text-gray-900 font-bold text-xl scale-110" : "text-gray-400 text-base scale-90",
                )}
                style={{ height: `${ITEM_HEIGHT}px` }}
                onClick={() => {
                  scrollToIndex(columnRef, index, true);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-1 bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
      <WheelColumn
        items={hours}
        selectedValue={currentValue.hour}
        columnRef={hourRef}
        onScroll={() => handleScroll(hourRef, hours, "hour")}
      />
      <div className="text-3xl font-bold text-gray-300 mx-1 select-none">:</div>
      <WheelColumn
        items={minutes}
        selectedValue={currentValue.minute}
        columnRef={minuteRef}
        onScroll={() => handleScroll(minuteRef, minutes, "minute")}
      />
      <div className="w-16">
        <WheelColumn
          items={periods}
          selectedValue={currentValue.period}
          columnRef={periodRef}
          onScroll={() => handleScroll(periodRef, periods, "period")}
        />
      </div>
    </div>
  );
}
