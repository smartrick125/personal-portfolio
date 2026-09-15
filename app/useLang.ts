"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { copy, type Lang } from "./copy";

const STORAGE_KEY = "smartrick-lang";
const CHANGE_EVENT = "smartrick-lang-change";

/** Cached so `getSnapshot` stays cheap and returns a stable value. */
let current: Lang | null = null;

function readLang(): Lang {
  if (current) return current;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") {
      current = stored;
      return current;
    }
  } catch {
    // Private mode or blocked site data: fall through to browser detection.
  }
  current = navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  return current;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/**
 * Language state for the whole page.
 *
 * The server has no way to know the reader's preference, so it always renders
 * English. Reading localStorage during render is what broke the previous
 * switcher: the markup no longer matched what the server sent and hydration
 * threw the client tree away. `useSyncExternalStore` is the supported way to
 * say "server and first paint use this, the real client value follows" — the
 * server snapshot is always "en" and React re-renders once with the stored or
 * browser-detected value.
 *
 * Only an explicit click is written to storage, so a visitor auto-detected as
 * Chinese can still switch back to English and have it stick.
 */
export function useLang() {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);

  useEffect(() => {
    document.documentElement.lang = copy[lang].htmlLang;
  }, [lang]);

  const changeLang = useCallback((next: Lang) => {
    current = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference just won't survive a reload; the toggle still works.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [lang, changeLang] as const;
}
