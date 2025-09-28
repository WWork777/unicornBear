/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Fastify server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.dev/docs/deployments/node/
 *
 */
import { type PlatformNode } from "@builder.io/qwik-city/middleware/node";
import "dotenv/config";
import Fastify from "fastify";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import FastifyQwik from "./plugins/fastify-qwik";

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare global {
  interface QwikCityPlatform extends PlatformNode {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), "..", "..", "dist");
const buildDir = join(distDir, "build");
const assetsDir = join(distDir, "assets");

// Allow for dynamic port and host
const PORT = parseInt(process.env.PORT ?? "3062");
const HOST = process.env.HOST ?? "0.0.0.0";

const start = async () => {
  // Create the fastify server
  // https://fastify.dev/docs/latest/Guides/Getting-Started/
  const fastify = Fastify({
    logger: true,
  });

  // Enable compression
  // https://github.com/fastify/fastify-compress
  // IMPORTANT NOTE: THIS MUST BE REGISTERED BEFORE THE fastify-qwik PLUGIN
  // await fastify.register(import('@fastify/compress'))

  // Handle Qwik City using a plugin
  await fastify.register(FastifyQwik, { distDir, buildDir, assetsDir });

  // Start the fastify server
  await fastify.listen({ port: PORT, host: HOST });
};

// Start the server only if this file is executed directly (not when it's imported/bundled).
// In ESM the executed script path is available in process.argv[1]. We compare it to
// the file path of this module to decide whether to call start(). This prevents the
// server from being started during build steps which import this module.
// Do not auto-start the server during build/SSG or when run by other tooling.
// If you want to start the server in production, use the small helper script
// `scripts/start-fastify.js` which will call `start()` explicitly after build.
// This prevents accidental server startup during Qwik SSG which can crash the
// build process when native modules or listeners are used.
export { start };
