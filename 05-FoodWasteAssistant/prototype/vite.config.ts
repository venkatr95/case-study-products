import { defineConfig } from "vitest/config";

export default defineConfig({
  server: { port: 5185, strictPort: true },
  preview: { port: 4185, strictPort: true },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
