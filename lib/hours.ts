// Store hours + pickup-window math. Everything is computed in the store's own
// time zone, so a visitor in another zone still sees Yucaipa's real hours.
// Dependency-free on purpose — edit WEEK_HOURS below when the hours change.

export const STORE_TZ = "America/Los_Angeles";
export const PREP_MIN = 12; // ASAP = ready in about this long
export const SLOT_STEP = 15; // pickup windows land on 15-minute marks
export const DAYS_AHEAD = 7; // how far ahead a pickup can be scheduled

export interface DayHours {
  open: number; // minutes after midnight
  close: number; // last pickup time
}

// Index = JS weekday (0 = Sunday). null = closed all day.
export const WEEK_HOURS: (DayHours | null)[] = [
  null, // Sunday
  { open: 7 * 60, close: 13 * 60 + 30 }, // Monday
  { open: 7 * 60, close: 13 * 60 + 30 },
  { open: 7 * 60, close: 13 * 60 + 30 },
  { open: 7 * 60, close: 13 * 60 + 30 },
  { open: 7 * 60, close: 13 * 60 + 30 }, // Friday
  { open: 8 * 60, close: 14 * 60 }, // Saturday
];

export const ASAP_LABEL = `ASAP · ${PREP_MIN} min`;

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export interface PickupDay {
  key: string; // YYYY-MM-DD in store time
  isToday: boolean;
  relative: string; // "Today" | "Tomorrow" | "Mon"
  date: string; // "Sep 28"
  long: string; // "Monday, Sep 28"
  open: number;
  close: number;
}

function storeClock(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { y: n("year"), m: n("month"), d: n("day"), minutes: (n("hour") % 24) * 60 + n("minute") };
}

// Earliest pickup minute left today: now + prep, rounded up to the next mark, never before opening.
function earliestToday(hours: DayHours, minutes: number): number {
  return Math.max(hours.open, Math.ceil((minutes + PREP_MIN) / SLOT_STEP) * SLOT_STEP);
}

// Open days (that still have a pickup time left) from today through DAYS_AHEAD.
export function pickupDays(now: Date): PickupDay[] {
  const clock = storeClock(now);
  const out: PickupDay[] = [];
  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const date = new Date(Date.UTC(clock.y, clock.m - 1, clock.d + i));
    const wd = date.getUTCDay();
    const hours = WEEK_HOURS[wd];
    if (!hours) continue;
    if (i === 0 && earliestToday(hours, clock.minutes) > hours.close) continue;
    const dateLabel = `${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCDate()}`;
    out.push({
      key: date.toISOString().slice(0, 10),
      isToday: i === 0,
      relative: i === 0 ? "Today" : i === 1 ? "Tomorrow" : WEEKDAYS_SHORT[wd],
      date: dateLabel,
      long: `${WEEKDAYS_LONG[wd]}, ${dateLabel}`,
      open: hours.open,
      close: hours.close,
    });
  }
  return out;
}

// Every pickup time on a day: "ASAP" first when the store is open right now,
// then each 15-minute mark through closing (from the next mark on for today).
export function pickupTimes(day: PickupDay, now: Date): string[] {
  const clock = storeClock(now);
  let start = day.open;
  let asap = false;
  if (day.isToday) {
    start = earliestToday({ open: day.open, close: day.close }, clock.minutes);
    asap = clock.minutes >= day.open && clock.minutes + PREP_MIN <= day.close;
  }
  const slots: string[] = [];
  for (let m = start; m <= day.close; m += SLOT_STEP) slots.push(fmtTime(m));
  return asap ? [ASAP_LABEL, ...slots] : slots;
}

export interface PickupChoice {
  days: PickupDay[];
  day: PickupDay;
  times: string[];
  slot: string; // resolved time within `day`
  label: string; // full human label, e.g. "1:15 PM" or "Mon, Sep 28 · 7:15 AM"
  openToday: boolean; // false when today has no pickup times left (closed / past last pickup)
}

// Resolve what's actually selected: falls back to the first open day / first time
// whenever the stored choice has aged out (time passed, day rolled over) or isn't valid.
export function resolvePickup(now: Date, dayKey: string | null, slot: string | null): PickupChoice {
  const days = pickupDays(now);
  const day = days.find((d) => d.key === dayKey) ?? days[0];
  const times = pickupTimes(day, now);
  const chosen = slot && times.includes(slot) ? slot : times[0];
  const dayPrefix = day.isToday ? "" : `${day.relative === "Tomorrow" ? "Tomorrow" : `${day.relative}, ${day.date}`} · `;
  return { days, day, times, slot: chosen, label: `${dayPrefix}${chosen}`, openToday: days[0].isToday };
}
