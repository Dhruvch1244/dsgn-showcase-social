/**
 * The accent preset, modelled as an external store rather than React state.
 *
 * The value's real home is the `data-accent` attribute on <html> — it is set
 * by an inline script before first paint (see app/layout.tsx) so there is no
 * flash of the wrong palette on load. React is a *reader* of that attribute,
 * not its owner, which is what `useSyncExternalStore` is for: a component
 * subscribing here always renders the same value the DOM already has,
 * including on the server pass (where `getServerSnapshot` returns the
 * default).
 *
 * No React import at module scope beyond the hook itself, and no component:
 * this file is the boundary between "a preference the document owns" and
 * "a component that wants to display it".
 */

"use client";

import { useSyncExternalStore } from "react";

export const ACCENTS = [
  {
    id: "aurora",
    label: "Aurora",
    /** Swatch preview. Duplicated from globals.css on purpose — see note below. */
    from: "#3ce0f0",
    to: "#a06bff",
  },
  { id: "ember", label: "Ember", from: "#ff5fa2", to: "#ffb14d" },
  { id: "bloom", label: "Bloom", from: "#b06bff", to: "#ff5fa2" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

export const DEFAULT_ACCENT: AccentId = "aurora";
const STORAGE_KEY = "thrum:accent";

function isAccent(value: string | null): value is AccentId {
  return ACCENTS.some((a) => a.id === value);
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): AccentId {
  const current = document.documentElement.getAttribute("data-accent");
  return isAccent(current) ? current : DEFAULT_ACCENT;
}

function getServerSnapshot(): AccentId {
  return DEFAULT_ACCENT;
}

/** Reads the active accent preset, re-rendering when it changes. */
export function useAccent(): AccentId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Switches the accent preset.
 *
 * Writes the attribute first and notifies subscribers second, so any
 * component that re-renders in response is guaranteed to read the value the
 * document already has rather than one frame behind it. `localStorage` is
 * wrapped because it throws outright in a locked-down/private context in
 * some browsers, and losing a colour preference should never take the app
 * down with it.
 */
export function setAccent(next: AccentId): void {
  document.documentElement.setAttribute("data-accent", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Preference not persisted; the in-session value still applies. */
  }
  listeners.forEach((l) => l());
}

/**
 * The pre-paint bootstrap, inlined into <head> as a string.
 *
 * Lives here next to the store it primes rather than as a loose string
 * literal in layout.tsx, so the storage key and the fallback can never drift
 * apart from the reader above. Kept to one statement and wrapped in
 * try/catch: a throw here would run before hydration and blank the page.
 */
export const ACCENT_BOOTSTRAP = `try{var a=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(a==="aurora"||a==="ember"||a==="bloom"){document.documentElement.setAttribute("data-accent",a)}}catch(e){}`;
