import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.tsx"],
    format: ["esm"],
    deps: { neverBundle: ["react", "dayjs"] },
    dts: true,
    sourcemap: true,
    tsconfig: "./tsconfig.build.json"
});
