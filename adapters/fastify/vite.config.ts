import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  // Allow toggling SSG via environment variable QWIK_SSG.
  // If QWIK_SSG is '0' or 'false' (case-insensitive), SSG will be disabled (ssg: null).
  const raw = process.env.QWIK_SSG;
  const disableSSG = raw === '0' || String(raw).toLowerCase() === 'false';

  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.fastify.tsx", "@qwik-city-plan"],
      },
    },
    // Use a stub by default to avoid native crashes during SSG. Set USE_REAL_SHARP=1 to
    // prefer the real 'sharp' from node_modules.
    resolve: {
      alias: process.env.USE_REAL_SHARP === '1' ? [] : [{ find: 'sharp', replacement: '../../shims/sharp-stub.cjs' }],
    },
    plugins: [
      nodeServerAdapter({
        name: "fastify",
        // When disabled, pass null to avoid running the static generator during build.
        ssg: disableSSG
          ? null
          : {
              // Minimal include pattern to satisfy AdapterSSGOptions type
              include: ["**/*"],
            },
      }),
    ],
  };
});
