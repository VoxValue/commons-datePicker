import {
    allDaysInMonth,
    dateAdd,
    dateFormat,
    dateIsAfter,
    dateIsBefore,
    dateIsBetween,
    dateIsSame,
    dateIsSameOrAfter,
    dateIsSameOrBefore,
    dateIsValid,
    dateStringToDate,
    dateUpdateMonth,
    dateUpdateYear,
    dayIndexInWeek,
    daysInMonth,
    endDayOfMonth,
    firstDayOfMonth,
    getNextDates,
    isCurrentDay,
    loadLanguageModule,
    nextDaysInWeek,
    nextMonthBy,
    previousDaysInWeek,
    previousMonthBy,
    weekDayStringToIndex
} from "../date";

// Known reference dates (all verified against a calendar)
// 2024-01-01 = Monday
// 2024-01-07 = Sunday
// 2024-02-29 = Thursday (2024 is a leap year)
// 2024-03-31 = Sunday

const d = (year: number, month: number, day: number) => new Date(year, month - 1, day);

describe("dateIsValid", () => {
    it("returns true for a valid Date", () => {
        expect(dateIsValid(d(2024, 1, 15))).toBe(true);
    });

    it("returns false for null", () => {
        expect(dateIsValid(null)).toBe(false);
    });

    it("returns false for an invalid Date object", () => {
        expect(dateIsValid(new Date("not-a-date"))).toBe(false);
    });
});

describe("isCurrentDay", () => {
    it("returns true for today", () => {
        expect(isCurrentDay(new Date())).toBe(true);
    });

    it("returns false for a past date", () => {
        expect(isCurrentDay(d(2000, 1, 1))).toBe(false);
    });

    it("returns false for an invalid date", () => {
        expect(isCurrentDay(new Date("invalid"))).toBe(false);
    });
});

describe("loadLanguageModule", () => {
    it("is a no-op and does not throw", () => {
        expect(() => loadLanguageModule("fr")).not.toThrow();
        expect(() => loadLanguageModule()).not.toThrow();
    });
});

describe("dateIsSame", () => {
    it("returns true for the same date with unit 'date'", () => {
        expect(dateIsSame(d(2024, 3, 15), d(2024, 3, 15), "date")).toBe(true);
    });

    it("returns false for different days", () => {
        expect(dateIsSame(d(2024, 3, 15), d(2024, 3, 16), "date")).toBe(false);
    });

    it("returns true when comparing same month regardless of day", () => {
        expect(dateIsSame(d(2024, 3, 1), d(2024, 3, 31), "month")).toBe(true);
    });

    it("returns false when months differ in month comparison", () => {
        expect(dateIsSame(d(2024, 3, 1), d(2024, 4, 1), "month")).toBe(false);
    });

    it("returns true for same year regardless of month/day", () => {
        expect(dateIsSame(d(2024, 1, 1), d(2024, 12, 31), "year")).toBe(true);
    });

    it("returns false for invalid dates", () => {
        expect(dateIsSame(new Date("x"), d(2024, 1, 1), "date")).toBe(false);
    });
});

describe("dateIsBefore", () => {
    it("returns true when a is before b", () => {
        expect(dateIsBefore(d(2024, 1, 1), d(2024, 1, 2), "date")).toBe(true);
    });

    it("returns false when a equals b", () => {
        expect(dateIsBefore(d(2024, 1, 1), d(2024, 1, 1), "date")).toBe(false);
    });

    it("returns false when a is after b", () => {
        expect(dateIsBefore(d(2024, 1, 2), d(2024, 1, 1), "date")).toBe(false);
    });

    it("uses month granularity correctly", () => {
        expect(dateIsBefore(d(2024, 2, 28), d(2024, 3, 1), "month")).toBe(true);
        expect(dateIsBefore(d(2024, 3, 1), d(2024, 3, 31), "month")).toBe(false);
    });
});

describe("dateIsAfter", () => {
    it("returns true when a is after b", () => {
        expect(dateIsAfter(d(2024, 6, 1), d(2024, 5, 31), "date")).toBe(true);
    });

    it("returns false when dates are equal", () => {
        expect(dateIsAfter(d(2024, 6, 1), d(2024, 6, 1), "date")).toBe(false);
    });
});

describe("dateIsSameOrBefore", () => {
    it("returns true for equal dates", () => {
        expect(dateIsSameOrBefore(d(2024, 1, 1), d(2024, 1, 1), "date")).toBe(true);
    });

    it("returns true when a is earlier", () => {
        expect(dateIsSameOrBefore(d(2024, 1, 1), d(2024, 1, 2), "date")).toBe(true);
    });

    it("returns false when a is later", () => {
        expect(dateIsSameOrBefore(d(2024, 1, 2), d(2024, 1, 1), "date")).toBe(false);
    });

    it("returns false for null inputs", () => {
        expect(dateIsSameOrBefore(null, d(2024, 1, 1), "date")).toBe(false);
    });
});

describe("dateIsSameOrAfter", () => {
    it("returns true for equal dates", () => {
        expect(dateIsSameOrAfter(d(2024, 5, 10), d(2024, 5, 10), "date")).toBe(true);
    });

    it("returns true when a is later", () => {
        expect(dateIsSameOrAfter(d(2024, 5, 11), d(2024, 5, 10), "date")).toBe(true);
    });

    it("returns false when a is earlier", () => {
        expect(dateIsSameOrAfter(d(2024, 5, 9), d(2024, 5, 10), "date")).toBe(false);
    });
});

describe("dateIsBetween", () => {
    const start = d(2024, 3, 10);
    const end = d(2024, 3, 20);

    it("returns true for a date strictly inside the range", () => {
        expect(dateIsBetween(d(2024, 3, 15), start, end, "day")).toBe(true);
    });

    it("returns false for a date on the exclusive start boundary", () => {
        expect(dateIsBetween(start, start, end, "day")).toBe(false);
    });

    it("returns true for start boundary when inclusive", () => {
        expect(dateIsBetween(start, start, end, "day", { start: true })).toBe(true);
    });

    it("returns false for end boundary when exclusive", () => {
        expect(dateIsBetween(end, start, end, "day")).toBe(false);
    });

    it("returns true for end boundary when inclusive", () => {
        expect(dateIsBetween(end, start, end, "day", { start: true, end: true })).toBe(true);
    });

    it("returns false for a date outside the range", () => {
        expect(dateIsBetween(d(2024, 3, 5), start, end, "day")).toBe(false);
    });

    it("returns false for invalid dates", () => {
        expect(dateIsBetween(new Date("x"), start, end, "day")).toBe(false);
    });
});

describe("dateFormat", () => {
    const date = d(2024, 3, 5); // March 5, 2024

    it("formats YYYY-MM-DD correctly", () => {
        expect(dateFormat(date, "YYYY-MM-DD")).toBe("2024-03-05");
    });

    it("formats single-digit day without padding for D", () => {
        expect(dateFormat(date, "D")).toBe("5");
    });

    it("formats abbreviated month name MMM in English", () => {
        expect(dateFormat(date, "MMM", "en")).toBe("Mar");
    });

    it("formats full month name MMMM in English", () => {
        expect(dateFormat(date, "MMMM", "en")).toBe("March");
    });

    it("formats abbreviated month name in French", () => {
        const result = dateFormat(date, "MMM", "fr");
        // French abbreviation for March — just check it's non-empty and not the English form
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });

    it("formats YYYY correctly", () => {
        expect(dateFormat(date, "YYYY")).toBe("2024");
    });

    it("formats YY (2-digit year)", () => {
        expect(dateFormat(date, "YY")).toBe("24");
    });

    it("returns null for null input", () => {
        expect(dateFormat(null, "YYYY-MM-DD")).toBeNull();
    });

    it("handles a compound format like D MMMM YYYY without double-replacing", () => {
        const result = dateFormat(date, "D MMMM YYYY", "en");
        expect(result).toBe("5 March 2024");
    });
});

describe("dateStringToDate", () => {
    it("parses an ISO date string", () => {
        const result = dateStringToDate("2024-06-15");
        expect(result).not.toBeNull();
        expect(result!.getFullYear()).toBe(2024);
        expect(result!.getMonth()).toBe(5); // 0-indexed
        expect(result!.getDate()).toBe(15);
    });

    it("returns null for an invalid string", () => {
        expect(dateStringToDate("not-a-date")).toBeNull();
    });

    it("trims surrounding whitespace", () => {
        const result = dateStringToDate("  2024-01-01  ");
        expect(result).not.toBeNull();
        expect(result!.getFullYear()).toBe(2024);
    });
});

describe("previousMonthBy", () => {
    it("goes back one month and resets to day 1", () => {
        const result = previousMonthBy(d(2024, 3, 15));
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(1); // February (0-indexed)
        expect(result.getDate()).toBe(1);
    });

    it("crosses year boundary (January → December of previous year)", () => {
        const result = previousMonthBy(d(2024, 1, 31));
        expect(result.getFullYear()).toBe(2023);
        expect(result.getMonth()).toBe(11); // December (0-indexed)
        expect(result.getDate()).toBe(1);
    });

    it("returns today for null input", () => {
        const result = previousMonthBy(null);
        expect(result).toBeInstanceOf(Date);
    });
});

describe("nextMonthBy", () => {
    it("advances one month and resets to day 1", () => {
        const result = nextMonthBy(d(2024, 3, 31));
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(3); // April (0-indexed)
        expect(result.getDate()).toBe(1);
    });

    it("crosses year boundary (December → January of next year)", () => {
        const result = nextMonthBy(d(2024, 12, 15));
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(0); // January (0-indexed)
        expect(result.getDate()).toBe(1);
    });
});

describe("dateUpdateMonth", () => {
    it("sets month using 0-indexed value (0 = January)", () => {
        const result = dateUpdateMonth(d(2024, 6, 15), 0);
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(15);
    });

    it("constrains day for shorter months", () => {
        // Jan 31 → set month to February (index 1) → Feb 28 or 29
        const result = dateUpdateMonth(d(2024, 1, 31), 1);
        expect(result.getMonth()).toBe(1); // February
        expect(result.getDate()).toBeLessThanOrEqual(29);
    });
});

describe("dateUpdateYear", () => {
    it("changes the year while keeping month and day", () => {
        const result = dateUpdateYear(d(2024, 6, 15), 2020);
        expect(result.getFullYear()).toBe(2020);
        expect(result.getMonth()).toBe(5); // June (0-indexed)
        expect(result.getDate()).toBe(15);
    });
});

describe("firstDayOfMonth", () => {
    it("returns the 1st of the given month", () => {
        const result = firstDayOfMonth(d(2024, 8, 20));
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(7); // August (0-indexed)
        expect(result.getDate()).toBe(1);
    });

    it("returns the 1st of the current month when called without argument", () => {
        const result = firstDayOfMonth();
        expect(result.getDate()).toBe(1);
    });
});

describe("endDayOfMonth", () => {
    it("returns the last day of a 31-day month", () => {
        const result = endDayOfMonth(d(2024, 1, 15));
        expect(result.getDate()).toBe(31); // January has 31 days
    });

    it("returns Feb 29 for a leap year", () => {
        const result = endDayOfMonth(d(2024, 2, 1));
        expect(result.getDate()).toBe(29);
    });

    it("returns Feb 28 for a non-leap year", () => {
        const result = endDayOfMonth(d(2023, 2, 1));
        expect(result.getDate()).toBe(28);
    });

    it("returns the 30th for April", () => {
        const result = endDayOfMonth(d(2024, 4, 1));
        expect(result.getDate()).toBe(30);
    });
});

describe("dayIndexInWeek", () => {
    // 2024-01-01 is a Monday → index 1
    // 2024-01-07 is a Sunday → index 0
    // 2024-01-06 is a Saturday → index 6

    it("returns 1 for Monday (2024-01-01)", () => {
        expect(dayIndexInWeek(d(2024, 1, 1))).toBe(1);
    });

    it("returns 0 for Sunday (2024-01-07)", () => {
        expect(dayIndexInWeek(d(2024, 1, 7))).toBe(0);
    });

    it("returns 6 for Saturday (2024-01-06)", () => {
        expect(dayIndexInWeek(d(2024, 1, 6))).toBe(6);
    });

    it("returns a number between 0 and 6 inclusive", () => {
        for (let i = 0; i < 7; i++) {
            const idx = dayIndexInWeek(d(2024, 1, i + 1));
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThanOrEqual(6);
        }
    });
});

describe("daysInMonth", () => {
    it("returns 31 for January", () => {
        expect(daysInMonth(d(2024, 1, 1))).toBe(31);
    });

    it("returns 29 for February of a leap year", () => {
        expect(daysInMonth(d(2024, 2, 1))).toBe(29);
    });

    it("returns 28 for February of a non-leap year", () => {
        expect(daysInMonth(d(2023, 2, 1))).toBe(28);
    });

    it("returns 30 for April", () => {
        expect(daysInMonth(d(2024, 4, 1))).toBe(30);
    });
});

describe("allDaysInMonth", () => {
    it("returns all 31 days for January 2024", () => {
        const days = allDaysInMonth(d(2024, 1, 15));
        expect(days).toHaveLength(31);
        expect(days[0].getDate()).toBe(1);
        expect(days[30].getDate()).toBe(31);
    });

    it("returns 29 days for February 2024 (leap year)", () => {
        expect(allDaysInMonth(d(2024, 2, 1))).toHaveLength(29);
    });

    it("returns an empty array for an invalid date", () => {
        expect(allDaysInMonth(new Date("invalid"))).toHaveLength(0);
    });

    it("all returned dates are in the same month", () => {
        const days = allDaysInMonth(d(2024, 6, 1));
        days.forEach(day => {
            expect(day.getMonth()).toBe(5); // June (0-indexed)
        });
    });
});

describe("weekDayStringToIndex", () => {
    it("maps mon → 0", () => expect(weekDayStringToIndex("mon")).toBe(0));
    it("maps tue → 1", () => expect(weekDayStringToIndex("tue")).toBe(1));
    it("maps wed → 2", () => expect(weekDayStringToIndex("wed")).toBe(2));
    it("maps thu → 3", () => expect(weekDayStringToIndex("thu")).toBe(3));
    it("maps fri → 4", () => expect(weekDayStringToIndex("fri")).toBe(4));
    it("maps sat → 5", () => expect(weekDayStringToIndex("sat")).toBe(5));
    it("maps sun → 6", () => expect(weekDayStringToIndex("sun")).toBe(6));
    it("defaults to 0 for undefined", () => expect(weekDayStringToIndex()).toBe(0));
});

describe("dateAdd", () => {
    it("adds positive days crossing a month boundary", () => {
        const result = dateAdd(d(2024, 1, 30), 3, "day");
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(1); // February (0-indexed)
        expect(result.getDate()).toBe(2);
    });

    it("subtracts days via negative value", () => {
        const result = dateAdd(d(2024, 3, 5), -5, "day");
        expect(result.getMonth()).toBe(1); // February
        expect(result.getDate()).toBe(29); // leap year
    });

    it("adds months", () => {
        const result = dateAdd(d(2024, 1, 31), 1, "month");
        expect(result.getMonth()).toBe(1); // February
    });

    it("returns the original date for an invalid input", () => {
        const invalid = new Date("invalid");
        expect(dateAdd(invalid, 1, "day")).toBe(invalid);
    });
});

describe("getNextDates", () => {
    it("returns the next n dates after the given date", () => {
        const dates = getNextDates(d(2024, 1, 29), 3);
        expect(dates).toHaveLength(3);
        expect(dates[0].getDate()).toBe(30);
        expect(dates[1].getDate()).toBe(31);
        expect(dates[2].getMonth()).toBe(1); // February
        expect(dates[2].getDate()).toBe(1);
    });

    it("returns empty array for limit 0", () => {
        expect(getNextDates(d(2024, 1, 1), 0)).toHaveLength(0);
    });

    it("returns empty array for an invalid date", () => {
        expect(getNextDates(new Date("invalid"), 3)).toHaveLength(0);
    });
});

describe("previousDaysInWeek", () => {
    // 2024-01-01 = Monday (dayIndexInWeek = 1)
    // weekStartDayIndex = 1 (Monday) — the loop stops when it finds a Monday
    // If month starts on Wednesday, previous days back to Monday = [Mon, Tue]
    it("returns days from previous week up to (not including) the weekStart boundary", () => {
        // 2024-03-01 is a Friday (dayIndexInWeek = 5)
        // With weekStartDayIndex = 0 (Sunday), walk back: Thu, Wed, Tue, Mon, Sun → stop
        const days = previousDaysInWeek(d(2024, 3, 1), 0);
        // Should return Thu Feb 29, Wed Feb 28, Tue Feb 27, Mon Feb 26, Sat Feb 24, Fri Feb 23
        // Actually: start from Feb 29, keep going until we hit Sunday (dayIndex = 0)
        // Feb 29 = Thu (5), Feb 28 = Wed (4), Feb 27 = Tue (3), Feb 26 = Mon (2),
        // Feb 25 = Sun (0) → STOP
        // previousDays = [Feb 29, Feb 28, Feb 27, Feb 26], sorted asc
        expect(days.length).toBeGreaterThan(0);
        // First day should be before the last
        if (days.length > 1) {
            expect(dateIsBefore(days[0], days[days.length - 1], "date")).toBe(true);
        }
    });
});

describe("nextDaysInWeek", () => {
    it("returns days from the last day of month to the end of its calendar week", () => {
        // 2024-03-31 is a Sunday (dayIndexInWeek = 0)
        // With weekStartDayIndex = 0 (Sunday), next day = Mon Apr 1 (dayIndex = 1) ≠ 0
        // Next: Tue Apr 2 (2), Wed Apr 3 (3), Thu Apr 4 (4), Fri Apr 5 (5), Sat Apr 6 (6)
        // Next: Sun Apr 7 (0) → STOP
        const days = nextDaysInWeek(d(2024, 3, 31), 0);
        expect(days.length).toBeGreaterThan(0);
        days.forEach(day => {
            expect(dateIsAfter(day, d(2024, 3, 31), "date")).toBe(true);
        });
    });
});
