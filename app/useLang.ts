"use client";

import { useEffect } from "react";
import { copy, type Lang } from "./copy";

const STORAGE_KEY = "smartrick-lang";

function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "zh" ? stored : null;
  } catch {
    // Private mode or blocked site data: treat as no preference.
    return null;
  }
}

/** Called when the reader picks a language, so the choice survives a reload. */
export function rememberLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // The link still navigates; only the memory is lost.
  }
}

/**
 * Language is a route now (`/` and `/zh`), not client state, so a crawler sees
 * each version as its own page and hreflang can point at both.
 *
 * Two things are still the client's job. The root layout renders a single
 * `<html lang>` and cannot know which route is being served, so the Chinese
 * page corrects it here. And a first-time Chinese-speaking visitor who lands on
 * the English URL gets sent across — only from `/`, only when they have not
 * already chosen English, so it cannot loop and never overrides an explicit
 * choice.
 */
export function useLanguageRouting(lang: Lang) {
  useEffect(() => {
    document.documentElement.lang = copy[lang].htmlLang;
  }, [lang]);

  useEffect(() => {
    if (lang !== "en" || window.location.pathname !== "/") return;

    const stored = readStoredLang();
    if (stored === "en") return;

    const wantsChinese =
      stored === "zh" || (!stored && navigator.language?.toLowerCase().startsWith("zh"));
    if (wantsChinese) window.location.replace("/zh");
  }, [lang]);
}
