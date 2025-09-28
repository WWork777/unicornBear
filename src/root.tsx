/* eslint-disable qwik/no-use-visible-task */
import { component$, isDev, useContextProvider, useStore, $, useVisibleTask$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import FullLoader from './components/FullLoader';

import "./global.css";
import { LangContext } from '@context/lang';
import type { LangType } from '@context/lang';

export default component$(() => {
  // store for the language state
  const state = useStore<{ lang: LangType }>({ lang: 'ru' });

  // QRL setter which mutates the state and persists to localStorage
  const setLang = $((value: LangType) => {
    state.lang = value;
    try {
      localStorage.setItem('lang', value);
    } catch {
      // ignore
    }
  });

  // provide an object with 'state' and 'setLang' (setLang is a QRL)
  useContextProvider(LangContext, { state, setLang });

  // Read persisted language from localStorage on client and initialize store
  useVisibleTask$(() => {
    try {
      const saved = localStorage.getItem('lang') as LangType | null;
      if (saved === 'ru' || saved === 'en') {
        state.lang = saved;
      }
    } catch {
      // ignore localStorage errors
    }
  });
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang={state.lang}>
        <FullLoader />
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
