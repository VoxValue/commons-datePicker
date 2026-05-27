import { LANGUAGE } from "../constants";
import { DateType, WeekDaysIndexType, WeekStringType } from "../types";

type DateUnit = "year" | "month" | "week" | "day" | "date";
type ManipulateUnit = "year" | "years" | "month" | "months" | "week" | "weeks" | "day" | "days";

function toPlainDate(date: Date): Temporal.PlainDate {
    return Temporal.PlainDate.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    });
}

function fromPlainDate(pd: Temporal.PlainDate): Date {
    return new Date(pd.year, pd.month - 1, pd.day);
}

function nowPlainDate(): Temporal.PlainDate {
    return Temporal.Now.plainDateISO();
}

function truncateUnit(pd: Temporal.PlainDate, unit: DateUnit): Temporal.PlainDate {
    switch (unit) {
        case "year":
            return pd.with({ month: 1, day: 1 });
        case "month":
            return pd.with({ day: 1 });
        default:
            return pd;
    }
}

function normalizeDurationUnit(unit: ManipulateUnit): "years" | "months" | "weeks" | "days" {
    switch (unit) {
        case "year":
        case "years":
            return "years";
        case "month":
        case "months":
            return "months";
        case "week":
        case "weeks":
            return "weeks";
        default:
            return "days";
    }
}

// no-op: locale is passed directly to Intl at format time
export function loadLanguageModule(_language = LANGUAGE): void {}

export function dateIsValid(date: DateType): date is Date {
    if (!date) return false;
    return !isNaN(date.getTime());
}

export function isCurrentDay(date: Date): boolean {
    if (!dateIsValid(date)) return false;
    return toPlainDate(date).equals(nowPlainDate());
}

export function dateIsSame(a: Date, b: Date, unit: DateUnit): boolean {
    if (!dateIsValid(a) || !dateIsValid(b)) return false;
    return (
        Temporal.PlainDate.compare(truncateUnit(toPlainDate(a), unit), truncateUnit(toPlainDate(b), unit)) === 0
    );
}

export function dateIsBefore(a: Date, b: Date, unit: DateUnit): boolean {
    if (!dateIsValid(a) || !dateIsValid(b)) return false;
    return (
        Temporal.PlainDate.compare(truncateUnit(toPlainDate(a), unit), truncateUnit(toPlainDate(b), unit)) < 0
    );
}

export function dateIsAfter(a: Date, b: Date, unit: DateUnit): boolean {
    if (!dateIsValid(a) || !dateIsValid(b)) return false;
    return (
        Temporal.PlainDate.compare(truncateUnit(toPlainDate(a), unit), truncateUnit(toPlainDate(b), unit)) > 0
    );
}

export function dateIsSameOrBefore(a: DateType, b: DateType, unit: DateUnit): boolean {
    if (!dateIsValid(a) || !dateIsValid(b)) return false;
    return (
        Temporal.PlainDate.compare(truncateUnit(toPlainDate(a), unit), truncateUnit(toPlainDate(b), unit)) <= 0
    );
}

export function dateIsSameOrAfter(a: DateType, b: DateType, unit: DateUnit): boolean {
    if (!dateIsValid(a) || !dateIsValid(b)) return false;
    return (
        Temporal.PlainDate.compare(truncateUnit(toPlainDate(a), unit), truncateUnit(toPlainDate(b), unit)) >= 0
    );
}

export function dateIsBetween(
    whoIsBetween: Date,
    start: Date,
    end: Date,
    unit: DateUnit,
    include?: { start?: boolean; end?: boolean }
): boolean {
    if (!dateIsValid(whoIsBetween) || !dateIsValid(start) || !dateIsValid(end)) return false;

    const pw = truncateUnit(toPlainDate(whoIsBetween), unit);
    const ps = truncateUnit(toPlainDate(start), unit);
    const pe = truncateUnit(toPlainDate(end), unit);

    const afterStart = include?.start
        ? Temporal.PlainDate.compare(pw, ps) >= 0
        : Temporal.PlainDate.compare(pw, ps) > 0;

    const beforeEnd = include?.end
        ? Temporal.PlainDate.compare(pw, pe) <= 0
        : Temporal.PlainDate.compare(pw, pe) < 0;

    return afterStart && beforeEnd;
}

export function dateFormat(date: DateType, format: string, locale = LANGUAGE): string | null {
    if (!dateIsValid(date)) return null;

    const pd = toPlainDate(date);
    const jsDate = fromPlainDate(pd);

    return format.replace(/MMMM|MMM|MM|M|YYYY|YY|DD|D/g, token => {
        switch (token) {
            case "YYYY":
                return String(pd.year);
            case "YY":
                return String(pd.year).slice(-2);
            case "MMMM":
                return new Intl.DateTimeFormat(locale, { month: "long" }).format(jsDate);
            case "MMM":
                return new Intl.DateTimeFormat(locale, { month: "short" }).format(jsDate);
            case "MM":
                return String(pd.month).padStart(2, "0");
            case "M":
                return String(pd.month);
            case "DD":
                return String(pd.day).padStart(2, "0");
            case "D":
                return String(pd.day);
            default:
                return token;
        }
    });
}

export function dateStringToDate(dateString: string): Date | null {
    const trimmed = dateString.trim();
    try {
        return fromPlainDate(Temporal.PlainDate.from(trimmed));
    } catch {
        const d = new Date(trimmed);
        return isNaN(d.getTime()) ? null : d;
    }
}

export function previousMonthBy(date: DateType): Date {
    if (!dateIsValid(date)) return fromPlainDate(nowPlainDate());
    return fromPlainDate(toPlainDate(date).subtract({ months: 1 }).with({ day: 1 }));
}

export function nextMonthBy(date: DateType): Date {
    if (!dateIsValid(date)) return fromPlainDate(nowPlainDate());
    return fromPlainDate(toPlainDate(date).add({ months: 1 }).with({ day: 1 }));
}

export function dateUpdateMonth(date: DateType, value: number): Date {
    if (!dateIsValid(date)) return fromPlainDate(nowPlainDate());
    // value is 0-indexed (0=Jan); Temporal months are 1-indexed
    return fromPlainDate(toPlainDate(date).with({ month: value + 1 }));
}

export function dateUpdateYear(date: DateType, value: number): Date {
    if (!dateIsValid(date)) return fromPlainDate(nowPlainDate());
    return fromPlainDate(toPlainDate(date).with({ year: value }));
}

export function firstDayOfMonth(date?: Date): Date {
    const pd = date && dateIsValid(date) ? toPlainDate(date) : nowPlainDate();
    return fromPlainDate(pd.with({ day: 1 }));
}

export function endDayOfMonth(date?: Date): Date {
    const pd = date && dateIsValid(date) ? toPlainDate(date) : nowPlainDate();
    return fromPlainDate(pd.with({ day: pd.daysInMonth }));
}

export function dayIndexInWeek(date?: Date): number {
    const pd = date && dateIsValid(date) ? toPlainDate(date) : nowPlainDate();
    // Temporal: Mon=1 … Sun=7  →  % 7 gives Sun=0, Mon=1 … Sat=6  (matches legacy dayjs .day())
    return pd.dayOfWeek % 7;
}

export function previousDaysInWeek(date: Date, weekStartDayIndex: WeekDaysIndexType = 0): Date[] {
    if (!dateIsValid(date)) return [];

    const previousDays: Date[] = [];

    let i = 1;
    let previousDay = dateAdd(date, -i, "day");
    while (dayIndexInWeek(previousDay) !== weekStartDayIndex) {
        previousDays.push(previousDay);
        i++;
        previousDay = dateAdd(date, -i, "day");
    }

    return previousDays.sort((a, b) => {
        if (dateIsAfter(a, b, "date")) return 1;
        return -1;
    });
}

export function nextDaysInWeek(date: Date, weekStartDayIndex: WeekDaysIndexType = 0): Date[] {
    if (!dateIsValid(date)) return [];

    const nextDays: Date[] = [];

    let i = 1;
    let nextDay = dateAdd(date, i, "day");
    while (dayIndexInWeek(nextDay) !== weekStartDayIndex) {
        nextDays.push(nextDay);
        i++;
        nextDay = dateAdd(date, i, "day");
    }

    return nextDays;
}

export function daysInMonth(date?: Date): number {
    const pd = date && dateIsValid(date) ? toPlainDate(date) : nowPlainDate();
    return pd.daysInMonth;
}

export function allDaysInMonth(date?: Date): Date[] {
    const checkDate = date || new Date();
    if (!dateIsValid(checkDate)) return [];

    const pd = toPlainDate(checkDate);
    const maxDays = pd.daysInMonth;

    const days: Date[] = [];
    for (let i = 1; i <= maxDays; i++) {
        days.push(fromPlainDate(pd.with({ day: i })));
    }
    return days;
}

export function weekDayStringToIndex(dayString?: WeekStringType): WeekDaysIndexType {
    switch (dayString) {
        case "mon":
            return 0;
        case "tue":
            return 1;
        case "wed":
            return 2;
        case "thu":
            return 3;
        case "fri":
            return 4;
        case "sat":
            return 5;
        case "sun":
            return 6;
        default:
            return 0;
    }
}

export function dateAdd(date: Date, value: number, unit: ManipulateUnit): Date {
    if (!dateIsValid(date)) return date;
    const pd = toPlainDate(date);
    const durationUnit = normalizeDurationUnit(unit);
    const result =
        value >= 0 ? pd.add({ [durationUnit]: value }) : pd.subtract({ [durationUnit]: -value });
    return fromPlainDate(result);
}

export function getNextDates(date: Date, limit: number): Date[] {
    if (!dateIsValid(date)) return [];

    const nextDates: Date[] = [];

    for (let i = 1; i <= limit; i++) {
        nextDates.push(dateAdd(date, i, "day"));
    }

    return nextDates;
}
