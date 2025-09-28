import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Menu from '@components/index-home/Menu';
import Header from '@components/index-home/Header';
import Footers from '@components/index-home/Footers';

export default component$(() => {
  // LangContext is provided in root.tsx; components will read it from context.

  return (
    <>
      <Menu />
      <Header />
      <Footers />
    </>
  );
});

export const head: DocumentHead = {
  title: "Unicorn Bear",
  meta: [
    { name: "description", content: "Unicorn Bear description" },
  ],
};
