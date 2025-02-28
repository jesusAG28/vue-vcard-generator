import vue from "rollup-plugin-vue";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/vue-vcard-generator.esm.js",
      format: "esm",
      exports: "named",
    },
    {
      file: "dist/vue-vcard-generator.umd.js",
      format: "umd",
      name: "VueVCardGenerator",
      exports: "named",
      globals: {
        vue: "Vue",
        qrcode: "QRCode",
      },
    },
  ],
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    vue({
      css: true,
      template: {
        isProduction: true,
      },
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    terser(),
  ],
  external: ["vue", "qrcode"],
};
