// Install Temporal polyfill for the Jest environment.
// The published library does NOT bundle this — consumers provide it at runtime.
import { Temporal } from "@js-temporal/polyfill";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Temporal ??= Temporal;
