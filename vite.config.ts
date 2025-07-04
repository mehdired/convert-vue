import { getDirname } from "@adonisjs/core/helpers";
import inertia from "@adonisjs/inertia/client";
import adonisjs from "@adonisjs/vite/client";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: "inertia/app/ssr.ts" } }),
    vue(),
    adonisjs({
      entrypoints: ["inertia/app/app.ts"],
      reload: ["resources/views/**/*.edge"],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      "~/": `${getDirname(import.meta.url)}/inertia/`,
    },
  },
});
