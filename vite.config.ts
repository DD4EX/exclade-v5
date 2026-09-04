// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // Keep React's hook dispatcher and renderer in the same optimized module
    // graph. Vite can otherwise create a second React instance during a cold
    // dependency scan, which makes hooks fail until the next reload.
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/client",
      ],
    },
    environments: {
      ssr: {
        optimizeDeps: {
          include: ["react-dom/server"],
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: {
      // Generated `?tsr-split=component` modules can enter a second optimized
      // React graph in the hosted preview, leaving the hook dispatcher null.
      // Keep route modules intact so every component uses the renderer's React.
      autoCodeSplitting: false,
    },
  },
});
