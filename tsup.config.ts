import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts", "playground/main.ts"],
  format: ["esm"],
  target: "es2020",
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
});
