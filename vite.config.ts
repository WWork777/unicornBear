/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { defineConfig, type UserConfig, type ResolvedConfig } from "vite";
import path from "path";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin makes start at `src/entry.ssr.tsx` instead.
 */
export default defineConfig(({ command, mode }): UserConfig => {
  const raw = process.env.QWIK_SSG;
  const enableSSG = !(raw === '0' || String(raw).toLowerCase() === 'false');

  // During SSG the build process executes server code which may load native
  // image-processing binaries (sharp). On some Windows/Node setups that causes
  // a native crash during the static generation step. To avoid that we remove
  // any plugin whose name contains "imagetools" during the SSG run. This is
  // a pragmatic workaround: it disables build-time image transforms but
  // restores a working SSG without requiring native binaries.
  const skipImageToolsDuringSSG = () => ({
    name: "skip-imagetools-during-ssg",
    configResolved(resolvedConfig: ResolvedConfig) {
      const isSsgBuild = command === "build" && mode === "production" && enableSSG;
      if (!isSsgBuild) return;

      try {
        const filtered = resolvedConfig.plugins.filter((p: any) => {
          return !(p && p.name && /imagetools/i.test(p.name));
        });
        // assign back to plugins via any cast because Vite's type marks it readonly
        (resolvedConfig as any).plugins = filtered;
      } catch (e) {
        // If something goes wrong here we intentionally ignore and let Vite continue
        // (we don't want to break non-SSG builds).
        // eslint-disable-next-line no-console
        console.warn("skip-imagetools-during-ssg plugin failed:", e);
      }
    },
  });

  const isSsgBuild = (command === "build" && mode === "production" && enableSSG);

  return {
    plugins: [skipImageToolsDuringSSG(), qwikCity(), qwikVite(), tsconfigPaths({ root: "." })],
    // When running SSG we alias 'sharp' to a safe JS stub to avoid loading
    // native binaries during the build. The stub provides minimal noop
    // functions so imports succeed without invoking native code.
    resolve: isSsgBuild
      ? {
          alias: [
            {
              find: "sharp",
              replacement: path.resolve(__dirname, "shims/sharp-stub.cjs"),
            },
          ],
        }
      : undefined,
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: [],
    },

    /**
     * This is an advanced setting. It improves the bundling of your server code. To use it, make sure you understand when your consumed packages are dependencies or dev dependencies. (otherwise things will break in production)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,

    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});

// *** utils ***

/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(
  devDependencies: PkgDep,
  dependencies: PkgDep,
) {
  let msg = "";
  // Create an array 'duplicateDeps' by filtering devDependencies.
  // If a dependency also exists in dependencies, it is considered a duplicate.
  const duplicateDeps = Object.keys(devDependencies).filter(
    (dep) => dependencies[dep],
  );

  // include any known qwik packages
  const qwikPkg = Object.keys(dependencies).filter((value) =>
    /qwik/i.test(value),
  );

  // any errors for missing "qwik-city-plan"
  // [PLUGIN_ERROR]: Invalid module "@qwik-city-plan" is not a valid package
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;

  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }

  // Format the error message with the duplicates list.
  // The `join` function is used to represent the elements of the 'duplicateDeps' array as a comma-separated string.
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;

  // Throw an error with the constructed message.
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
