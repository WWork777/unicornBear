import { createContextId } from "@builder.io/qwik";

export type LangType = 'ru' | 'en';

// Provide a 'state' store and a QRL setter separately to avoid serialization issues
export const LangContext = createContextId<{
  state: { lang: LangType };
  setLang: (value: LangType) => void;
}>('lang-context');
