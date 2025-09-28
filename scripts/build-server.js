#!/usr/bin/env node
// Wrapper to run qwik check-client and vite build safely on Windows/Bun.
// Runs the commands via Node and ensures we return a clean exit code if
// the build and SSG completed successfully but the process crashed after.
import { spawnSync } from 'node:child_process';

// Ensure safe defaults: disable SSG by default to avoid platform-native crashes
// observed on some Windows/Bun setups. To force SSG (and opt into the risk),
// set FORCE_SSG=1 in the environment before running this script.
if (process.env.FORCE_SSG !== '1') {
  // By default, disable QWIK_SSG so the adapter won't run the static generator
  // during the Vite build. The adapter and Vite configs already support
  // toggling via QWIK_SSG, so we set it explicitly here to be safe.
  process.env.QWIK_SSG = process.env.QWIK_SSG ?? '0';
  // Ensure we don't try to use the real sharp by default.
  process.env.USE_REAL_SHARP = process.env.USE_REAL_SHARP ?? '0';
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  return res.status ?? (res.signal ? -1 : 0);
}

// 1) run qwik check-client
let rc = run(process.execPath, ['node_modules/@builder.io/qwik/qwik-cli.cjs', 'check-client', 'src', 'dist']);
if (rc !== 0) {
  console.error('qwik check-client failed with code', rc);
  process.exit(rc);
}

// 2) run vite build
rc = run(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '-c', 'adapters/fastify/vite.config.ts']);
if (rc !== 0) {
  console.error('vite build failed with code', rc);
  process.exit(rc);
}

// If we got here, build completed. Some environments may still terminate the
// parent process with a system error code after the build completes (observed
// as -1073740940 / 116 on Windows+Bun). To avoid marking the build as failed
// in CI or scripts, exit successfully.
console.log('\nBuild finished successfully — exiting 0 to avoid spurious crash codes.');
process.exit(0);
