import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";

/**
 * Temporary Vite config used only for diagnosing native crash.
 * This config intentionally omits the `qwikCity()` plugin which
 * triggers the Qwik City SSG step during a normal production build.
 *
 * Use only for debugging: run `node node_modules/vite/bin/vite.js build -c adapters/fastify/vite.no-ssg.config.ts`
 */
export default defineConfig((): UserConfig => {
  return {
    plugins: [
      // Include the Qwik optimizer plugin, but omit qwikCity to avoid SSG
      qwikVite(),
      tsconfigPaths({ root: "." }),
      // Adapter for server build
      nodeServerAdapter({ name: "fastify" }),
    ],
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.fastify.tsx", "@qwik-city-plan"],
      },
    },
  };
});
