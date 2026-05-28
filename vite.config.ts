// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

// Post-build validator: after Vite emits the bundle, assert the Worker entry
// that wrangler/Cloudflare will load actually exists. Catches drift between
// tanstackStart.server.entry and the emitted dist/ layout before deploy.
const EXPECTED_SERVER_ENTRY = "dist/server/server.js";
const SERVER_RUNTIME_NO_EXTERNAL = [
  "h3-v2",
  "h3",
  "rou3",
  "srvx",
  "@tanstack/start-server-core",
  "@tanstack/react-start-server",
];

function validateServerEntry(): Plugin {
  return {
    name: "lovable:validate-server-entry",
    apply: "build",
    enforce: "post",
    closeBundle: {
      sequential: true,
      order: "post",
      handler() {
        // Only validate on the SSR/server build pass that emits the entry.
        const entryPath = resolve(process.cwd(), EXPECTED_SERVER_ENTRY);
        if (!existsSync(resolve(process.cwd(), "dist/server"))) return;
        if (!existsSync(entryPath) || !statSync(entryPath).isFile()) {
          throw new Error(
            `[lovable:validate-server-entry] Expected Worker entry "${EXPECTED_SERVER_ENTRY}" was not emitted. ` +
              `vite.config.ts has tanstackStart.server.entry = "server" — confirm src/server.ts exists ` +
              `and the TanStack Start plugin output path still matches.`,
          );
        }
      },
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      // These are imported by the server entry during Worker startup. If Vite
      // leaves them as bare runtime imports, the deployed Worker crashes with
      // errors like: No such module "h3-v2" imported from "server.js".
      noExternal: SERVER_RUNTIME_NO_EXTERNAL,
    },
    environments: {
      ssr: {
        resolve: {
          noExternal: SERVER_RUNTIME_NO_EXTERNAL,
        },
      },
    },
    plugins: [validateServerEntry()],
  },
});
