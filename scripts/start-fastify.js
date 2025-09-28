#!/usr/bin/env node
// Helper to start the built Fastify server after a production build.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Ensure we import using a file:// URL on Windows (Node ESM loader requires it)
const builtServerPath = path.join(process.cwd(), 'server', 'entry.fastify.js');
const builtServer = pathToFileURL(builtServerPath).href;

async function main() {
  try {
    // dynamic import of the built server
    const mod = await import(builtServer);
    // some builds export start, some call the function directly; prefer an exported
    // start() if available, else do nothing.
    if (mod && typeof mod.start === 'function') {
      await mod.start();
    } else if (mod && typeof mod.default === 'function') {
      await mod.default();
    } else {
      console.error('Built server does not export a start() function.');
      process.exit(1);
    }
  } catch (e) {
    console.error('Failed to start built server:', e);
    process.exit(1);
  }
}

main();
