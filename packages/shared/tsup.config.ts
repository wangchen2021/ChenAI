import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // 唯一入口
  format: ["esm", "cjs"], // 同时生成 ESM + CJS 产物
  outDir: "dist", // 根输出目录
  // 自动拆分 ESM/CJS 产物到子目录（企业级规范）
  outExtension: ({ format }) => ({
    js: format === "cjs" ? ".cjs" : ".mjs", // 显式后缀：.cjs/.mjs（避免混淆）
  }),
  dts: true, // 自动生成统一的类型声明（无需拆分）
  clean: true, // 构建前清空 dist
  target: "es2020", // 适配 Node.js 16+
  sourcemap: true, // 生成 sourcemap（调试用）
  minify: false, // 开发阶段不压缩，生产可开启
  treeshake: true, // 摇树优化
});
