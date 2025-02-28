import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "VueVCardGenerator",
      formats: ["es", "umd"],
      fileName: (format) => `vue-vcard-generator.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "qrcode"],
      output: {
        globals: {
          vue: "Vue",
          qrcode: "QRCode",
        },
      },
    },
  },
});
